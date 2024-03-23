import React from 'react'
import './Question.css'
import he from 'he';
function Question({question,options,id,handleChange}) {

  return (
    <>
    _________________________________________________________________
      <div className='question'>{he.decode(question)}</div>
      <div className='options'>
        {
            options.map((el,index)=>{
                return <div className='option' key={index}>
                    <input 
                        name ={(id).toString()} 
                        type='radio' 
                        onChange={handleChange}
                        value={index} 
                        required 
                    />
                    <label >{he.decode(el)} </label>
                </div>
            })
        }
      </div>

    </>
  )
}

export default Question
