const Subscription = require('../models/subscription.js')
const logger = require('../logger.js')

exports.getAll = async (req,res)=>{
    try{
        const subscriptions = await Subscription.find();
        res.status(200).json(subscriptions);
        logger.info(`Fetched all subscriptions`);
    }catch(error){
        console.error(error);
        logger.error(`Failed to fetch subscriptions: ${error.message}`);
        res.status(500).json({message: 'Internal server error'});
    }``
}

exports.getByEmail = async (req,res)=>{
    try{
        const subscriptions = await Subscription.findOne({email:req.params.email});
        res.status(200).json(subscriptions);
        logger.info(`Fetched subscriptions for user ${req.params.email}`);
    }catch(error){
        console.error(error);
        logger.error(`Failed to fetch subscriptions: ${error.message}`);
        res.status(500).json({message: 'Internal server error'});
    }``
}

exports.create = async (req,res)=>{
    try{
        console.log(req.body)
        const{email,subscription} = req.body;
        const client = await Subscription.findOne({email:email});
        if(client){
            client.subscriptions.push(subscription);
            await client.save();
        }
        else await Notification.create({email: email,subscriptions: [subscription]})
        logger.info(`Notification sent to user ${email}`);
        res.status(201).json(`Notification Sent to user ${email}`);
    }catch(error){
        console.error(error);
        logger.error(`Failed to send notification: ${error.message}`);
        res.status(500).json({message: 'Internal server error'});
    }``
}