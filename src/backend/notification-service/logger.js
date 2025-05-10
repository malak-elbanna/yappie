const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = '/var/log/notification-service';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: path.join(logDir, 'app.log'),
            maxsize: 5242880, 
            maxFiles: 5
        })
    ]
});

module.exports = logger;
