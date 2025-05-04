const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
const logger = require('./logger');

require('dotenv').config();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('mongo connected'));

app.use('/reviews', reviewRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Review Service running on port ${PORT}`));
logger.info('Review service started');