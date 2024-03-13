import React from 'react'
import AttackList from '../Data/AttackList.json'
import "./Attacker.css"

export default function Attacker() {
  return (
    <div className='attacker'>
      <h1>Attacker Intro: </h1>
      <p>Choose your attacker type</p>
      
      {
        AttackList.map((item)=>{
            return(
            <p className = "atk-item" key = {item.id}>{item.name}</p>
                    // <AttackItem/>
            )
        })
      }
    </div>
  )
}
