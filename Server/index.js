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
function quizFormat(data){
    const quizData = data.results //is a list of objects
    ans = [];
    const formattedQuiz = quizData.map((el,id)=>{
        var totalOptions =  el.incorrect_answers.length +1;
        var randomAnsIndex = Math.floor(Math.random() * totalOptions);
        ans.push(randomAnsIndex); // storing real ans
        var options = shuffleArray([...el.incorrect_answers]); //shuffling 
        options.push(el.correct_answer);
        [options[randomAnsIndex],options[totalOptions-1] ] = [options[totalOptions-1],options[randomAnsIndex]];
        quizData.options = options
        return  {'question':el.question,'options':options}
    })
    // console.log(ans);
    return formattedQuiz;
}
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

    socket.on("request_quiz",(data)=>{ // handling quiz request 
        var amt = 7;
        var dif = 'easy';
        switch (data.selected) {
            case 2:
                amt = 7;dif='medium'
                break;
            case 3:
                amt=10;dif='medium';
                break;
            case 4:
                amt=7;dif='hard';
                break;
            case 5:
                amt=10;dif='hard';
                break;
            default:
                break;
        }
        const apiUrl = `https://opentdb.com/api.php?amount=${amt}&category=${data.quizValue}&difficulty=${dif}`;
        
        axios.get(apiUrl).then((res)=>{ //fethcing quiz
            const quizSend = quizFormat(res.data);
            //console.log(ans);//working
            room = data.roomId;
            socket.emit("load_quiz",{quizSend,response:0}); //emitting to requested socket only
        }).catch((err)=>{
            socket.emit("load_quiz",{quizSend:[] ,response:5});
            // console.log(err.response.data);
        })
        // console.log(data);//working = quiz request data
    })
    socket.on('quizSubmit',(data)=>{  //calculating score
        // console.log(data.answers);//working
        socket.score =  userScore(ans,data.answers) // calculating score
        console.log(`score: ${socket.score}`);
        // io.to(socket.room).emit('showScore',{score:socket.score , role:socket.role});
        score.push(socket.score);
    
        socket.emit('showScore',{score : socket.score,winPercentage:null });
        if(score.length==2){
            io.to(socket.room).emit('startCountdown',{});
            console.log(score);
        }
    })
    socket.on('showResult',(data)=>{  //finding win percentage
        if(score.length==2){
            const totalScore = calculateTotalScore();
            socket.winPercentage = (socket.score / totalScore)*100;
            socket.emit('showWinP',{status:1,winP:socket.winPercentage });
        }else{
            socket.emit('showWinP',{status:0,winP:null });
        }
    })
})


///////////////Backend running
server.listen(3001,()=>{
    console.log("Server is running...")
})