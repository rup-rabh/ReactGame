import React from 'react'
import AttackList from '../../Data/AttackList.json'
import "./Attacker.css"
import { useEffect,useState } from "react";
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")

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
    const [message,setMessage]=useState('');
    const [messageRecieved,setMessageRecieved]=useState('');
    const sendMessage  = () =>{
      socket.emit("send_message",{message}); //since both key and value are same
    };
  
    useEffect(()=>{
      socket.on("recieve_message",(data)=>{
          setMessageRecieved(data.message);
      })
    })
  return (
    <div className='attacker'>

        <div>

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
        <div className='sideHUD' >
                <div className='chat' style={{color:"lightgreen"}}>

                <input placeholder='Message...' onChange={(event)=>{
                    setMessage(event.target.value);
                }}/>
                <button className='test-btn' onClick={sendMessage}>Send</button>
                <h2>Message:</h2>
                {messageRecieved}
                </div>
                <div className='goToQz'>
                    Next
                </div>
            </div>
    </div>
  )
}
