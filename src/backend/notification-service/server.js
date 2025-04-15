const amqp = require('amqplib');
const express = require('express');

const cors = require('cors');
const io = require('socket.io')(4000,{
    cors: {
        origin: 'http://localhost:5173',
    },
})

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('SUBSCRIBE',(message)=>{
        console.log('Client subscribed:', socket.id);
        console.log('Subscribed to topics:', message);
    })

})

console.log('Socket.io server running on port 4000');
