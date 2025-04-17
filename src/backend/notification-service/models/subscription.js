const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    topic:{ type: String, required: true, unique: true},
    key: [String]
});

const subscriptionssSchema = new mongoose.Schema({
    email:{ type:String, required: true,unique: true},
    subscriptions: [subscriptionSchema], // Array of subscriptions
});

module.exports = mongoose.model("notifications", notificationsSchema);