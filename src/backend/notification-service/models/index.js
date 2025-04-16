const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/masmoo3');
    console.log('Database Connected!');
  } catch (err) {
    console.error('Database Connection Failed:', err);
    process.exit(1);
  }
};

module.exports = connectToMongo;