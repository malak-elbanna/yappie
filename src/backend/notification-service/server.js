const express = require('express');
const app = express();
const socket = require('./Socket');
const cors = require('cors');
const port = 4000;
const connectToMongo = require('./models');
const notificationRouter = require('./routes/notificationRouter.js');
const subscriptionRouter = require('./routes/subscriptionRouter.js');
const logger = require('./logger.js');
const promBundle = require('express-prom-bundle');
const client = require('prom-client'); 

const requestDurationHistogram = new client.Histogram({
  name: 'notification_request_duration_seconds',
  help: 'Histogram for the duration of notification service requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5] 
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
  customLabels: { project_name: 'notification-service' },
  promClient: {
    collectDefaultMetrics: {
      timeout: 1000,
    },
  },
});

app.use(metricsMiddleware);

connectToMongo();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'notification-service',
  });
});

app.use('/notification', notificationRouter);
app.use('/subscription', subscriptionRouter);

const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
logger.info('Notification service started');
socket(httpServer);
