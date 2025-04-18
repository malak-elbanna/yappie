const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('mongo connected'));

app.use('/reviews', reviewRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Review Service running on port ${PORT}`));
