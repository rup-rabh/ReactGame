import React, { useEffect, useState } from 'react'
import './Engagement.css'
export default function Engagement({socket}) {
    const [score,setScore] = useState(null);
    const [countDown,setCountDown] = useState(null);
    // const [playerRole,setPlayerRole] = useState([]);
    let intervalId;

    const startInterval = () => {
      intervalId = setInterval(() => {
        setCountDown(prevCountDown => {
          if (prevCountDown <= 0) {
            socket.emit("showResult", {});
            clearInterval(intervalId);
            return 0;
          } else {
            console.log(prevCountDown);
            return prevCountDown - 1;
          }
        });
      }, 1000);
    };
    

    if(countDown===5){
      startInterval();
    }


    useEffect( () => {
        socket.on('showScore',(data)=>{
            setScore(data.score);
            // setPlayerRole([...playerRole,data.role]);
        });
        socket.on('startCountdown',(data)=>{
            setCountDown(5);
            console.log("countdown triggered");
            
        });
        socket.on('showWinP',(data)=>{
          if(data.status === 1 ){
            alert(data.winP);
          }else{
            alert("Rival has not submitted yet");
          }
        })
        
    } , [socket])

  return (
    <div className='engagement'>
      <p>We will show results here </p>
      {
        score !== null && <div>your score is {score}</div>
      }
      {/* <button onClick={showResults}>See results</button> */}
      {
        countDown!==null && <div> countDown : {countDown}</div>
      }
    </div>
  )
}
