const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI+'notifications_db');
    console.log('Mongo Connected!');
  } catch (err) {
    console.error('Database Connection Failed:', err);
    process.exit(1);
  }
};

module.exports = connectToMongo;