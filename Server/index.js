const express = require("express")
const app = express();
const http = require("http")
const {Server} = require("socket.io")

const cors = require("cors")
app.use(cors());
const server  = http.createServer(app);
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
    cors: {

        origin:"http://localhost:3000",

        methods: ["GET", "POST"]
    }
})
io.on("connection",(socket)=>{
    console.log(`User connected : ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data.room);
    })

    socket.on("send_message",(data)=>{
        // console.log(data);
        // socket.broadcast.emit("recieve_message",data);
        socket.to(data.roomId).emit("recieve_message", data)
    })
})

app.post('/quizSubmit',(req,res)=>{
    console.log(req.body.subject);
    res.send("Submitted suckseglty");
})

server.listen(3001,()=>{
    console.log("Server is running...")
})