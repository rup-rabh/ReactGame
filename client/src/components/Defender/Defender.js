import React from 'react'
import "./Defender.css"
import DefenseList from "../../Data/DefendList.json"
import { useEffect,useState } from "react";
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")
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
            <div className='testing'>
                <input placeholder='Message...' onChange={(event)=>{
                    setMessage(event.target.value);
                }}/>
                <button className='test-btn' onClick={sendMessage}>Send</button>
                <h2>Message:</h2>
                {messageRecieved}
            </div>

        </div>
      )
}

export default Defender
