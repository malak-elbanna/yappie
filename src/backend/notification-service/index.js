const amqp = require('amqplib');

const mqClient = (async () => {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        console.log("RabbitMQ Connected");
        return {
            connection,
            connectToMQ: () => Promise.resolve(connection)
        };
    } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err);
        throw err; 
    }
})();

module.exports = mqClient;