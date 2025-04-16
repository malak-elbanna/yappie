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
    var consumerTag;
    socket.on('SUBSCRIBE',async (message)=>{
        console.log("Refreshing")
        console.log(consumerTag)
        // channel = await connection.createChannel();
        // await channel.assertExchange(exchange,'topic',{
        //     durable:false
        // });
        // queue = (await channel.assertQueue('',{exclusive:true})).queue;
        // message.forEach(function(key){
        //     channel.bindQueue(queue,exchange,key)
        // })
        // await channel.cancel(consumerTag);
        await channel.bindQueue(queue,exchange,message);
        channel.consume(queue,function(msg){
            console.log(`Message recieved ! : ${msg.content.toString()} `);
        },{noAck:false}).then((result)=>{consumerTag = result.consumerTag});
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
        tempChannel = channel;
        channel.consume(queue,function(msg){
            console.log(`Message recieved ! : ${msg.content.toString()} `);
        },{noAck:false}).then((result)=>{consumerTag = result.consumerTag});

    })

    socket.on('disconnect',()=>{
        console.log(`${socket.id} disconnected`)
        if(channel) {
            channel.close();
            console.log("Channel Closed");
        }
        if(connection) {
            connection.close();
            console.log("Connection Closed");
        }
    })


});

console.log('Socket.io server running on port 4000');
