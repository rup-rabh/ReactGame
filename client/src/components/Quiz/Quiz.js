import { useEffect, useState } from 'react';
import Question from './Question/Question';
import './Quiz.css'
import Engagement from '../Engagement/Engagement';
export default function Quiz({socket,roomId,role,selected}) {
    // const [startQuiz,setStartQuiz] = useState(false);
    const  [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const handleSubmit = (e) =>{        
        // setStartQuiz(true);
        e.preventDefault();
        const quizValue = e.target.subject.value;
        socket.emit("request_quiz",{quizValue,roomId,role,selected});
    }
    const handleChange = (e)=>{
        var  temp=[...answers];
        temp[e.target.name] = e.target.value;
        setAnswers(temp);
    }
    const handleQuizSubmit = (e)=>{
        setIsClicked(true);
        e.preventDefault();
        // console.log(answers);//working
        socket.emit("quizSubmit",{answers})
    }

    useEffect(()=>{
        socket.on("load_quiz",(data)=>{
            // console.log(data);
            if(data.response===0 ){
            setQuestions(data.quizSend);}
            else{
                alert("Wait atleast 5 seconds, the QuizApi takes time");
                // console.log(data.response);
            }
        })
    },[socket])
    if(!questions){
    return (
        <div className="quiz choose-subject">
            <h1>Quiz</h1>
            <div className="quiz-intro">
                <p>Text your opponent and negotiate one topic,after which the quiz score will determine the effectiveness of your chosen strategy in previous state
            <br/>Note: that you both need to select same quiz subject for fair evaluation</p>
            </div>
            
            <form onSubmit = {handleSubmit}>
                <label htmlFor="sub">Choose Subject:</label>
                <select name="subject">
                    <option value="9">General Knowledge</option>
                    <option value="10">Entertainment: Books</option>
                    <option value="11">Entertainment: Film</option>
                    <option value="12">Entertainment: Music</option>
                    <option value="13">Entertainment: Musicals &amp; Theatres</option>
                    <option value="14">Entertainment: Television</option>
                    <option value="15">Entertainment: Video Games</option>
                    <option value="16">Entertainment: Board Games</option>
                    <option value="17">Science &amp; Nature</option>
                    <option value="18">Science: Computers</option>
                    <option value="19">Science: Mathematics</option>
                    <option value="20">Mythology</option>
                    <option value="21">Sports</option>
                    <option value="22">Geography</option>
                    <option value="23">History</option>
                    <option value="24">Politics</option>
                    <option value="25">Art</option>
                    <option value="26">Celebrities</option>
                    <option value="27">Animals</option>
                    <option value="28">Vehicles</option>
                    <option value="29">Entertainment: Comics</option>
                    <option value="30">Science: Gadgets</option>
                    <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
                    <option value="32">Entertainment: Cartoon &amp; Animations</option>
                </select>
                <div className='subject-selection-button'>
                    <button type='sumbit' >Go</button>
                </div>
            </form>

        </div>
        
    )}else{
        if(!isClicked){
        return(
        <div className="quiz">
            <div className='quiz-area'>
            <h1>Quiz Area : </h1>
            <form onSubmit={handleQuizSubmit}>
                {
                    questions.map((el,index)=>{
                        return (
                        <Question 
                        key={index} 
                        question={el.question} 
                        options={el.options} 
                        id={index} 
                        handleChange={handleChange}
                        />
                        );
                    })
                }
                <button type = "submit" disabled={isClicked}>Submit quiz</button>
            </form>
            </div>
        </div>
        )
    } else {
            return(
                <>
                    <Engagement socket={socket}/>
                </>
            )
        }
    }
}