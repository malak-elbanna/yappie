const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
const promBundle = require('express-prom-bundle');
const logger = require('./logger');

require('dotenv').config();

const app = express();

const requestDurationHistogram = new client.Histogram({
  name: 'review_request_duration_seconds',
  help: 'Histogram for the duration of review service requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

app.use((req, res, next) => {
  const end = requestDurationHistogram.startTimer({
    method: req.method,
    route: req.path,
  });

  res.on('finish', () => {
    end({ status_code: res.statusCode });
  });

  next();
});

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: 'review-service' },
  promClient: {
    collectDefaultMetrics: {
      timeout: 1000,
    },
  },
});

app.use(metricsMiddleware);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const reviewRoutes = require('./routes/reviews');
app.use('/reviews', reviewRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Review Service running on port ${PORT}`));
logger.info('Review service started');