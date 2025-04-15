const amqp = require('amqplib');
const express = require('express');

const cors = require('cors');
const io = require('socket.io')(4000,{
    cors: {
        origin: 'http://localhost:5173',
    },
})

io.on('connection', async (socket) => {
    var exchange = 'topic_logs';
    var connection;
    var channel;
    socket.on('SUBSCRIBE',async (message)=>{
        console.log("Refreshing")
        await channel.close();
        channel = await connection.createChannel();
        await channel.assertExchange(exchange,'topic',{
            durable:false
        });
        queue = (await channel.assertQueue('',{exclusive:true})).queue;
        message.forEach(function(key){
            channel.bindQueue(queue,exchange,key)
        })
        channel.consume(queue,function(msg){
            console.log(`Message recieved ! : ${msg.content.toString()} `);
        },{noAck:true});
        message.forEach(function(key){
            channel.bindQueue(queue,exchange,key)
        })
    })
    socket.on('STARTED',async (message)=>{
        console.log('New client connected:', socket.id);
        connection = await amqp.connect('amqp://rabbitmq:5672')
        channel = await connection.createChannel();
        await channel.assertExchange(exchange,'topic',{
            durable:false
        });
        queue = (await channel.assertQueue('',{exclusive:true})).queue;
        await message.forEach(function(key){
            channel.bindQueue(queue,exchange,key)
        })
        channel.consume(queue,function(msg){
            console.log(`Message recieved ! : ${msg.content.toString()} `);
        },{noAck:true});

    })


});

console.log('Socket.io server running on port 4000');
