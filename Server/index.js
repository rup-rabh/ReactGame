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
    console.log(ans);
    return formattedQuiz;
}

function userScore(scoreKeeper,userAnswer){
    var score = 0;
    for (let index = 0; index < scoreKeeper.length; index++) {
        score +=(scoreKeeper[index] == userAnswer[index])
    }
    // console.log(scoreKeeper);//working
    // console.log(userAnswer);//working
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
            socket.emit("load_quiz",quizSend); //emitting to requested socket only
        }).catch((err)=>{
            console.log(err.data);
        })
        // console.log(data);//working = quiz request data
    })
    socket.on('quizSubmit',(data)=>{  //calculating score
        // console.log(data.answers);//working
        console.log(`score: ${userScore(ans,data.answers)}`);
    })

})

server.listen(3001,()=>{
    console.log("Server is running...")
})