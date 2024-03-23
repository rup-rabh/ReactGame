import React from 'react'
import './Question.css'
function Question() {
    const options = ["Jamal","Rahul","Anthony","Jotharo"];
    // const options = ["Jamal","Rahul"];
  return (
    <div>
      <div className='question'>Who Killed the fifth person on 1945 while on boat at a lake of Boston while eating a pizza with his legs and forgot to breath?</div>
      <div className='options'>
        {
            options.map((el,index)=>{
                return <div className='option' key={index}>{el}</div>
            })
        }
      </div>
    </div>
  )
}

export default Question
