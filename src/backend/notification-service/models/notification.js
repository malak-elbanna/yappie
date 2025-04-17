const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message:{ type: String, required: true },
    link: {type:String, required:false},
    date: {type:Date,require:false}
});

const notificationsSchema = new mongoose.Schema({
    email:{ type:String, required: true,unique: true},
    notifications: [notificationSchema], // Array of notifications
});

module.exports = mongoose.model("notifications", notificationsSchema);