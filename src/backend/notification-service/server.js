const express = require('express')
const app = express()
const socket = require('./Socket')
const cors = require('cors');
const port = 4000;
const connectToMongo = require('./models')
const notificationRouter = require('./routes/notificationRouter.js')
const subscriptionRouter = require('./routes/notificationRouter.js')

connectToMongo();
app.use(cors())
app.use(express.json());
app.use('/notification',notificationRouter);
app.use('/subscription',subscriptionRouter);


const httpServer = app.listen(port, () => {console.log(`Server listening on port ${port}`)});
socket(httpServer);


