const express = require("express")
const app = express();
const http = require("http")
const {Server} = require("socket.io")
const axios = require("axios");
const cors = require("cors")
const server  = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }));

var round = {};
var cumScore = {};
const payOff = [{min:0,max:0},{min:25,max:75},{min:30,max:50},{min:50,max:80}];
const tot_rounds = 5;
var gameAnalysis = {};
//////////////////////////Evaluating round score winner etc/////////////////////
function determinRoundWinner(round){
    const keys = Object.keys(round);
    const fP = keys[0];
    const sP = keys[1];
    if (round[fP] > round[sP]){
        return  [fP,sP];
    }else if (round[fP] < round[sP]){
        return [sP,fP];
    } else {   
        rno =  Math.floor(Math.random()*2)
        return [keys[rno],keys[1-rno]]; //if it's a tie, randomly choose one
    }
}

function determineWinner(cumScore){
    const keys = Object.keys(cumScore);
    const fP = keys[0];
    const sP = keys[1];
    if (cumScore[fP] > cumScore[sP]){
        return  [fP,sP];
    }else if (cumScore[fP] < cumScore[sP]){
        return [sP,fP];
    } else {   
        rno =  Math.floor(Math.random()*2)
        return [keys[rno],keys[1-rno]]; //if it's a tie, randomly choose one
    }
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
        // before connection room info
        console.log("Room joined");
        if(!skt || skt.size < 2){//handling user count in room
            //eligible to enter
            /////////////////not handling corresponding users right now///////////////////////
            socket.join(data.room);
            socket.role =data.role; //setting role
            socket.room =data.room; //setting room
            socket.emit("err_join",{response:1});
            socket.score = 100; //initializing score
            cumScore[socket.id]  = socket.score; //adding player id to the global array of scores
            gameAnalysis[socket.id]=[0];
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

    socket.on("duel",(data)=>{
        // console.log(data.selected); // working
        ind = data.selected;
        randomScore =Math.floor((Math.random() * (payOff[ind].max - payOff[ind].min)) + payOff[ind].min);
        round[socket.id] = randomScore;
        socket.score += randomScore;

        if(Object.keys(round).length === 2){
            const winner = determinRoundWinner(round)[0];
            const  looser = determinRoundWinner(round)[1];
            cumScore[winner]+= round[winner];
            cumScore[looser]-=  round[looser];
            
            
            io.to(winner).emit("roundResult",{win:1,score:cumScore[winner],roundScore :  round[winner] });
            io.to(looser).emit("roundResult", { win : 0 , score : cumScore[looser] , roundScore : round[looser]}) ;
            
            console.log(`round winner:${winner}`);
            console.log(`round looser:${looser}`);
            gameAnalysis[winner] = [...gameAnalysis[winner],[round[winner],round[looser]] ];
            gameAnalysis[looser] = [...gameAnalysis[looser],[round[looser],round[winner]] ];
            round = {};
        }
        if(data.round === tot_rounds){
            keys = Object.keys(cumScore);
            const winner = determineWinner(cumScore)[0];
            const looser = determineWinner(cumScore)[1];
            io.to(winner).emit("finResult",{win:1});
            io.to(looser).emit("finResult", {win:0});
            console.log(`match winner: ${winner}`);
            console.log(`match looser: ${looser}`);
            gameAnalysis[winner] = [...gameAnalysis[winner],[cumScore[winner],cumScore[looser]] ];
            gameAnalysis[looser] = [...gameAnalysis[looser],[cumScore[looser],cumScore[winner]] ];
            gameAnalysis[winner][0]=1; // winner code
        }

    });
    // socket.on("endGame",(data)=>{
    //     keys = Object.keys(cumScore);
    //     const winner = determineWinner(cumScore)[0];
    //     const looser = determineWinner(cumScore)[1];
    //     io.to(winner).emit("finResult",{win:1});
    //     io.to(looser).emit("finResult", {win:0});
    //     console.log(`match winner: ${winner}`);
    //     console.log(`match looser: ${looser}`);
    // })
    socket.on("analysis",(data)=>{
        socket.emit("analysisSend",gameAnalysis[socket.id]);
    })

})


///////////////Backend running
server.listen(3001,()=>{
    console.log("Server is running...")
})