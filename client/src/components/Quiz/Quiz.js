import { useEffect } from 'react';

export default function Quiz({socket}) {
    const handleSubmit = (e) =>{
        e.preventDefault();
    }
    useEffect(()=>{

    },[socket])    

    return (
        <div className="quiz">

            <h1>Quiz</h1>
            <div className="quiz-intro">
                <p>Text your opponent and negotiate one topic,after which the quiz score for will determine the effective of your chosen strategy in previous state
            <br/>Note that you both need to select same quiz subject for fair evaluation</p>
            </div>
            
            {/* <form action="http://localhost:3001/quizSubmit" method="post" >  */}
            <form onSubmit = {handleSubmit} > 
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
                <button type='sumbit' >Go</button>
            </form>
            <div className="quiz-area">

            </div>
        </div>
        
    )
}