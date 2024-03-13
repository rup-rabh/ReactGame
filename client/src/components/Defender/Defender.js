import React from 'react'
import "./Defender.css"
import DefenseList from "../../Data/DefendList.json"
//here I have to add options for Defender
function DefenseItem({item}){
    return (
        <div className="defense-card">
            <div className='name'><h3>Name : {item.name}</h3></div>
            <div className='description'>description: <p>
                {item.description}
                </p></div>
            <div className='cost'>Cost : {item.cost}</div>
        </div>
    )
}
function Defender() {
    return (
        <div className='defender'>
            <h1>Defender Intro: </h1>
            <p>Choose your Defense type</p>
            <div className='defense'>
                {
                DefenseList.map((item)=>{
                    return(
                        <DefenseItem 
                        key={item.id} 
                        item = {item}    
                        />
                        )
                        })
                }
            </div>
        </div>
      )
}

export default Defender
