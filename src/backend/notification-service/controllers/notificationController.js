amqp = require('amqplib')
const Notification = require('../models/notification.js')
const logger = require('../logger.js')
const mqClient = require('../index.js')

exports.getAll = async (req,res)=>{
    try{
        const notifications = await Notification.find();
        logger.info(`Fetched all notifications`);
        res.status(200).json(notifications);
    }catch(error){
        console.error(error);
        logger.error(`Failed to fetch notifications: ${error.message}`);
        res.status(500).json({message: 'Internal server error'});
    }``
}


exports.create = async (req,res)=>{
    try{
        console.log(req.body)
        const{email,notification} = req.body;
        const client = await Notification.findOne({email:email});
        console.log(client)
        if(client){
            client.notifications.push(notification);
            await client.save();
        }
        else await Notification.create({email: email,notifications: [notification]})
        logger.info(`Notification created for user ${email}`);
        res.status(201).json(`Notification Sent to user ${email}`);
    }catch(error){
        console.error(error);
        logger.error(`Failed to create notification: ${error.message}`);
        res.status(500).json({message: 'Internal server error'});
    }``
}

exports.publish = async (req,res)=>{
    try{
        message = req.body;
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        channel = await connection.createChannel();
        await channel.assertExchange('notifications','topic',{
            durable:true});
        channel.publish('notifications', message.author, Buffer.from(message.title));
        console.log(" [x] Sent %s:'%s'", message.author, message.title);
        logger.info(`Notification published to ${message.author}`);
        res.status(200).json("Notification published");
    }
    catch (err) {
        logger.error(`Failed to publish notification: ${err.message}`);
        console.warn(err);
        res.status(500).json({error: err.message});
    }

}