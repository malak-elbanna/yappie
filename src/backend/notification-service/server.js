const amqp = require('amqplib/callback_api');
const express = require('express');

const cors = require('cors');
const io = require('socket.io')(4000,{
    cors: {
        origin: 'http://localhost:5173',
    },
})

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on("SUBSCRIBE",(message)=>{
        amqp.connect('amqp://rabbitmq:5672',function(error0,connection){
            if(error0){throw error0;}
            connection.createChannel(function(error1, channel) {
                if (error1) {
                throw error1;
            }
            var exchange = 'topic_logs';
            channel.assertExchange(exchange,'topic',{
                durable:false
            });
            channel.assertQueue('',{
                exclusive:true
            },function(error2,q){
                if(error2){throw error2;}
                console.log('[*] waiting for notifications');
                message.forEach(function(key){
                    channel.bindQueue(q.queue,exchange,key);
                });
                channel.consume(q.queue,function(msg){
                    console.log(`Message recieved ! : ${msg.content.toString()} `);
                },{
                    noAck:true
                });
            });
        });
    });
});
});

console.log('Socket.io server running on port 4000');
