const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const port = 5000 || process.env.PORT;

const users = [{}];

app.use(cors())
app.get('/',(req,res)=>{
    res.send('Hi its working')
})
const server = http.createServer(app);

const io= socketIO(server);
// new connection 
io.on("connection",(socket)=>{
    console.log("New connection");
//  user joined 
    socket.on('joined',({user})=>{
        users[socket.id] = user;
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
        socket.emit('Welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]}`});
    })
// message send 
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})

    })
    // user disconnect 
    socket.on('disconect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has been left`})
        console.log('User left')
    })
})

server.listen(port,()=>{
    console.log(`Server is running on  http://localhost:${port}`)
})