const express = require('express')
const app = express()
const socket = require('./Socket')
const cors = require('cors');
const port = 4000;
const connectToMongo = require('./models')
const notificationRouter = require('./routes/notificationRouter.js')
const subscriptionRouter = require('./routes/notificationRouter.js')

var allowedOrigins = ['http://localhost:50001','http://localhost:5173'];
connectToMongo();
app.use(cors({
  origin: function(origin, callback){

    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}
))
app.use(express.json());
app.use('/notification',notificationRouter);
app.use('/subscription',subscriptionRouter);


const httpServer = app.listen(port, () => {console.log(`Server listening on port ${port}`)});
socket(httpServer);


