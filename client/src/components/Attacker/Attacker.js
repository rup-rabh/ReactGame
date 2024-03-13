import React from 'react'
import AttackList from '../../Data/AttackList.json'
import "./Attacker.css"
// id , name , description , cost
function AttackItem({item}){
    return (
        <div className="attack-card">
            <div className='name'><h3>Name : {item.name}</h3></div>
            <div className='description'>description: <p>
                {item.description}
                </p></div>
            <div className='cost'>Cost : {item.cost}</div>
        </div>
    )
}
export default function Attacker() {
  return (
    <div className='attacker'>
        <h1>Attacker Intro: </h1>
        <p>Choose your attacker type</p>
        <div className='attacks'>
            {
            AttackList.map((item)=>{
                return(
                    <AttackItem 
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
