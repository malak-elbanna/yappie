const mqClient = require('./index.js')

const realTimeConsume = async (message,email,socket)=> {
    try{
        console.log(socket.id)
        const {connection} = await mqClient; 
        channel = await connection.createChannel();

        await channel.assertExchange('notification','topic',{
            durable:true
        });

        queue = (await channel.assertQueue(`${email}`,{
            durable: true
        })).queue;

        await message.forEach(function(key){
            channel.bindQueue(queue,'notification',key)
        })



        channel.consume(queue,async function(msg){
            console.log(`Message recieved ! : ${msg.content.toString()} `);
            await socket.emit('RECIEVE',msg.content.toString());
            console.log('emitted')
            console.log('here',channel)
            channel.ack(msg);
            console.log('acked')
        },{noAck:false}).then((result)=>{consumerTag = result.consumerTag});

    }
    catch(err){console.error(err);}

    socket.on('disconnect',async ()=>{
        console.log(`${socket.id} disconnected`)
        if(channel) {
            await channel.close();
            console.log("channel closed");
        }
    })


}

module.exports = realTimeConsume;