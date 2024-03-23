import React from 'react'
import './Question.css'
function Question({question,options}) {

  return (
    <div >
      <div className='question'>{question}</div>
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
