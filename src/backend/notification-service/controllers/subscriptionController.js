const Subscription = require('../models/subscription.js')
exports.getAll = async (req,res)=>{
    try{
        const subscriptions = await Subscription.find();
        res.status(200).json(subscriptions);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }``
}

exports.getByEmail = async (req,res)=>{
    try{
        const subscriptions = await Subscription.findOne({email:req.params.email});
        res.status(200).json(subscriptions);
    }catch(error){
        console.error(error);
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
        res.status(201).json(`Notification Sent to user ${email}`);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }``
}