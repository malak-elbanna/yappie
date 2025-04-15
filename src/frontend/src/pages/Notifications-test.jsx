
import {io} from 'socket.io-client';    
import React, { useEffect, useState } from 'react';
const subscribeTo = ['ahmed','mohamed','ali nashaat']
const NotificationsTest = () => {
    const [socket,setSocket] = useState(null)
    useEffect(()=>{
        if(!socket){
            setSocket(io("http://localhost:4000"))
        }
    },[socket])
    useEffect(() => {
        if(!socket) return;
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });
    },[socket]);
    
    const subscribe = () => {
        socket.emit('SUBSCRIBE',subscribeTo);
    };

  return (
    <div>
      <h1>Notifications</h1>
      <p>This is the notifications page.</p>
      <button onClick={subscribe}>Subscribe</button>
    </div>
  );
}
export default NotificationsTest;