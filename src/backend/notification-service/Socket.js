const amqp = require('amqplib');
const express = require('express');
const cors = require('cors');
const {Server} = require('socket.io')


const StartSocket = (app)=>{
    const io = new Server(app,{
        cors: {
        origin: "http://localhost:5173"
  }
});
    io.on('connection', async (socket) => {
    var exchange = 'subscription';
    var connection;
    var channel;
    var consumerTag;
    socket.on('SUBSCRIBE',async (message)=>{
        console.log("Refreshing")
        console.log(consumerTag)
        // await channel.cancel(consumerTag);
        await channel.bindQueue(queue,exchange,message);
    })
    socket.on('STARTED',async (message,email)=>{
        console.log('New client connected:', socket.id);
        connection = await amqp.connect('amqp://rabbitmq:5672')
        channel = await connection.createChannel();
        await channel.assertExchange(exchange,'topic',{
            durable:true
        });
        queue = (await channel.assertQueue(`${email}`,{
            durable: true
        })).queue;
        await message.forEach(function(key){
            channel.bindQueue(queue,exchange,key)
        })
        tempChannel = channel;
        channel.consume(queue,async function(msg){
            console.log(`Message recieved ! : ${msg.content.toString()} `);
            await socket.emit('RECIEVE',msg.content.toString());
            channel.ack(msg);
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
    console.log('Socket.io server running on port 4000');

});
};

module.exports = StartSocket;


