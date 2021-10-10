const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const body_parser = require('body-parser')
const cokkie_session = require('cookie-session')
// const { json } = require('body-parser')
const ids= require('./Room_IDS')
const passport = require('passport')
const mongoose = require('mongoose')
const cors = require("cors")
require('./DataBase/connect')
require('dotenv').config()


app.use(
  cokkie_session({
    maxAge:24*60*60*1000, //24 hours
    keys:['df1bs1bds1vsd98sd1']
  })
)

// Peer
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use(passport.initialize())
app.use(passport.session())
require('./Config/passport')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use("/peerjs", peerServer);
app.use(body_parser.urlencoded({extended:false}))
app.use(body_parser.json())

// Set a Router
app.use('/',require('./Router/routes'))
// app.use(function(req, res, next) {
//   req.setHeader("Content-Type", "application/json");
//   res.setHeader("Content-Type", "application/json");
//   next();
// });



io.on('connection', socket => {

  
    console.log("Socket Connected..")
  

  socket.on('join-room', (roomId, userId,username) => {
    socket.join(roomId)
    console.log("=========================")
    console.log("Room Id ==> "+roomId)
    console.log("User Id ==> "+userId)
    
    socket.to(roomId).broadcast.emit('user-connected', userId)
    

        // When new user join
        // socket.on('new_user_joined',(name)=>{

          // socket.join(roomId)
          // console.log(name)
          // userId = name
          // console.log(users)

      socket.to(roomId).broadcast.emit('user_joined'  ,  username+' joined the chat')
  
      // })

    // send a message 
      socket.on('send',(message)=>{
      socket.to(roomId).broadcast.emit('receive',{message:message , user:username})
      })

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      // window.location('/')
      socket.to(roomId).broadcast.emit('leave',{message:username})
    })
  })
})

app.use(cors({
  origin: process.env.COVID_API_URLL
}))

server.listen( process.env.PORT ||8001,()=>{
  console.log("Server is running on port no 8001")
})

