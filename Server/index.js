const express = require("express")
const app = express();
const http = require("http")
const {Server} = require("socket.io")
const axios = require("axios");
const cors = require("cors")
const server  = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
var ans=[];
var score = [];

////////////////////////shuffling answers///////////////////////////////////////////////////////
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  /////////////////////Formatting quiz for client's request////////////////////////////////

//////////////////////////Calculating score of quiz for giving  answer of user/////////////////////
function userScore(scoreKeeper,userAnswer){
    var score = 0;
    for (let index = 0; index < scoreKeeper.length; index++) {
        score +=(scoreKeeper[index] == userAnswer[index])
    }
    // console.log(scoreKeeper);//working
    // console.log(userAnswer);//working
    return score;
}
function calculateTotalScore(){
    return score.reduce((acc,currVal)=>acc+currVal,0);
}

//////////////////////Setting server with cors////////////////////////////////
const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
////////////////////////Socket Connections//////////////////////////////////
io.on("connection",(socket)=>{
    console.log(`User connected : ${socket.id}`);

    socket.on("join_room",(data)=>{//handling joining room
        // data contans room as well as role
        skt = io.sockets.adapter.rooms.get(data.room);
        console.log(skt); // before connection room info    
        if(!skt || skt.size < 2){//handling user count in room
            //eligible to enter 
            /////////////////not handling alternative users right now///////////////////////
            socket.join(data.room);
            socket.role =data.role; //setting role
            socket.room =data.room; //setting room
            socket.emit("err_join",{response:1});
        }else{
            socket.emit("err_join",{response:0});   
        }
        skt = io.sockets.adapter.rooms.get(data.room);
        console.log(skt)// before connection room info
       
    })

    socket.on("send_message",(data)=>{//handling chat
        // socket.broadcast.emit("recieve_message",data);
        room = data.roomId;
        socket.to(room).emit("recieve_message", data);
    })

   


})


///////////////Backend running
server.listen(3001,()=>{
    console.log("Server is running...")
})