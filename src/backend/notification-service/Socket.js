const amqp = require('amqplib');
const express = require('express');
const cors = require('cors');
const {Server} = require('socket.io')
const realTimeConsume = require('./workers/realtimer.js')


const StartSocket = (app)=>{
    const io = new Server(app,{
        cors: {
        origin: "http://localhost:5173"
  }
});
    io.on('connection', async (socket) => {
    socket.on('STARTED',async (message,email)=>{
        console.log('New client connected:', socket.id);
        realTimeConsume(message,email,socket);
    })


    console.log('Socket.io server running on port 4000');

});
};

module.exports = StartSocket;


