import express from 'express';
import Colors from 'colors';
// import path from 'path';
const app = express();
import { Server } from 'socket.io';

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, ()=>{
    console.log(`Server listening on Port : ${PORT}`.bold.cyan);
})

const io = new Server(server);
let socketConnect = new Set();

app.use(express.static('./public'));

io.on('connection',onConnected);

function onConnected(socket) {
    console.log(`Socket Connected : ${socket.id}`.bold.green);
    socketConnect.add(socket.id);

    io.emit('client-total',socketConnect.size);

    socket.on('disconnect',()=>{
        console.log(`Socket Disconnected : ${socket.id}`.bold.red);
        socketConnect.delete(socket.id);
        io.emit('client-total',socketConnect.size);
    })

    socket.on('message',(data)=>{

        socket.broadcast.emit('chat-message',data);
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data);
    })
}