import React, { useEffect,useState } from 'react';
import './Duel.css';
export default function Duel({score, setScore ,socket,round,setRound,setDuelClicked ,setNext,next}) {
  const [resultReq, setResultReq] =  useState(false);
  const [resultShown, setResultShown] =  useState(false);
  useEffect( () => {  
    if(socket){
      socket.on("roundResult",(data)=>{
        setRound(prev=>{return prev+1});
        setScore((state)=>{
          return ([...state, {
              score:data.score,
              roundScore: data.roundScore,
              win:data.win,
              }]);
        })
        if(!resultReq){
          setDuelClicked(false);
        }
      });
    }
  },[socket,setRound,setScore,setDuelClicked,resultReq]);
  const roundNumbers = 5;
  useEffect(()=>{
    if(socket){
      if(round===roundNumbers && !resultReq){
        socket.emit("endGame",{});
        setResultReq(true);
        console.log("triggered request endgame");

      }
      if(!resultShown){
        socket.on("finResult",(data)=>{
          console.log("triggered");
          if(data.win){
            alert(`Congratulations you won`);
          }else{
            alert(`Sorry you lost`);
          }
          setResultShown(true);
        })
    }
    }
  },[round,socket,setResultReq,resultReq,setResultShown,resultShown])

  return (
    <div>
      
      {
        score.map((el,ind)=>{
          return(<div key = {ind} className={el.win? "roundResult won" : "roundResult lost"} >
             Round: {ind+1} Score:{el.score}  Win:{el.win} roundScore:{el.roundScore}
          </div>)
        })
        
      }
      current round: {round}
    </div>
  )
}
