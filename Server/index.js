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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
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
    return formattedQuiz;
}

function userScore(scoreKeeper,userAnswer){
    var score = 0;
    for (let index = 0; index < scoreKeeper.length; index++) {
        score +=(scoreKeeper[index] == userAnswer[index])
    }
    return score;
}

const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection",(socket)=>{
    console.log(`User connected : ${socket.id}`);

    socket.on("join_room",(data)=>{//handling joining room
        socket.join(data.room); //can access role too here
    })

    socket.on("send_message",(data)=>{//handling chat
        // socket.broadcast.emit("recieve_message",data);
        room = data.roomId;
        socket.to(room).emit("recieve_message", data);
    })

    socket.on("request_quiz",(data)=>{ // handling quiz request 
        
        const apiUrl = `https://opentdb.com/api.php?amount=10&category=${data.quizValue}&difficulty=easy&type=multiple`;
        
        axios.get(apiUrl).then((res)=>{
            const quizSend = quizFormat(res.data);
            //console.log(ans);//working
            room = data.roomId;
            socket.emit("load_quiz",quizSend);
        }).catch((err)=>{
            console.log(err);
        })
        console.log(data);//
    })
    socket.on('quizSubmit',(data)=>{
        console.log(data.answers);
        console.log(userScore(ans,data.answers));
    })

})


server.listen(3001,()=>{
    console.log("Server is running...")
})