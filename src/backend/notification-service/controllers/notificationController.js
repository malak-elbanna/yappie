const Notification = require('../models/notification.js')
exports.getAll = async (req,res)=>{
    try{
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    }catch(error){
        console.error(error);
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
        res.status(201).json(`Notification Sent to user ${email}`);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }``
}