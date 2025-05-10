const mqClient = require('../index.js');

const checkBind = async () =>{
    let channel;
    let consumerTag;

    try {
        const { connection } = await mqClient;
        channel = await connection.createChannel();

        await channel.assertExchange('jobs', 'topic', { durable: true });
        await channel.assertExchange('notifications', 'topic', { durable: true });
        const queue = (await channel.assertQueue(`binder`, { durable: true })).queue;

        await channel.bindQueue(queue,'jobs','BIND')

        const handleMessage = async (msg) => {
            const content = msg.content.toString().split('/')
            await channel.assertQueue(content[0],{durable:true});
            await channel.bindQueue(content[0],'notifications',`#.${content[1]}.#`);
            console.log('queue is bound! : ' + content)
        };

        const consumeResult = await channel.consume(
            queue,
            handleMessage,
            { noAck: false }
        );
        consumerTag = consumeResult.consumerTag;
    }catch (err) {
        console.error("RabbitMQ setup failed:", err);
        if(channel) await channel.close();
        throw err;
    }
}

module.exports = checkBind;