const mqClient = require('./index.js');

const realTimeConsume = async (message, email, socket) => {
    let channel;
    let consumerTag;

    try {
        const { connection } = await mqClient;
        channel = await connection.createChannel();

        await channel.assertExchange('notification', 'topic', { durable: true });
        const queue = (await channel.assertQueue(`${email}`, { durable: true })).queue;

        await Promise.all(message.map(key => 
            channel.bindQueue(queue, 'notification', key)
        ));

        const handleMessage = async (msg) => {
            if (!channel) return; 
            
            try {
                console.log(`Message received: ${msg.content.toString()}`);
                console.log('socket: ',socket.id)
                await socket.emit('RECEIVE', msg.content.toString());
                channel.ack(msg);
            } catch (err) {
                console.error("Message processing failed:", err);
                channel.nack(msg, false, true); 
            }
        };

        const consumeResult = await channel.consume(
            queue,
            handleMessage,
            { noAck: false }
        );
        consumerTag = consumeResult.consumerTag;

        socket.on('disconnect', async () => {
            console.log(`${socket.id} disconnected`);
            await cleanupChannel();
        });

        process.on('SIGINT', cleanupChannel);
        process.on('SIGTERM', cleanupChannel);

    } catch (err) {
        console.error("RabbitMQ setup failed:", err);
        await cleanupChannel();
        throw err;
    }

    async function cleanupChannel() {
        try {
            if (channel && consumerTag) {
                await channel.cancel(consumerTag);
            }
            if (channel) {
                await channel.close();
                console.log("Channel closed gracefully");
            }
        } catch (cleanupErr) {
            console.error("Error during cleanup:", cleanupErr);
        } finally {
            channel = null;
            consumerTag = null;
        }
    }
};

module.exports = realTimeConsume;