import React from 'react'
import './GameAnalysis.css'
export default function GameAnalysis({gameAnalysis}) {
    const tot_rounds = 5;

    if(gameAnalysis){
    return (
    <div>
      {
         gameAnalysis[0]===1?<div className='winner'>Congratulations You Won!!!</div> :<div className='winner'>Sorry You lost</div> 
      }
      {
        gameAnalysis.map((el,id)=>{
            if(id===0 ||  id === tot_rounds+1){
                return <></>
            }
            return <div key={id} className={el[0]>el[1]?'roundResult won':'roundResult lost'}>You: {el[0]} Opponent : {el[1]}</div>
        })
        
      }
    <div className='totalScore'>Total Score: You:{gameAnalysis[tot_rounds+1][0]} Opponent:{gameAnalysis[tot_rounds+1][1]} </div>
    </div>
  )}

    return("");
  

}
