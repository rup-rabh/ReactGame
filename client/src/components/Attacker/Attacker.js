import React from 'react'
import AttackList from '../../Data/AttackList.json'
import "./Attacker.css"
import { useEffect,useState } from "react";

import Quiz from '../Quiz/Quiz';

// const socket = io.connect("http://localhost:3001")

// id , name , description , cost
function AttackItem({item,handleSelected}){

    return (
        <div className="attack-card" onClick={() =>handleSelected(item.id)}
        >
            <div className='name'><h3>Name : {item.name}</h3></div>
            <div className='description'>description: <p>
                {item.description}
                </p></div>
            <div className='cost'>Cost : {item.cost}</div>
        </div>
    )
}
export default function Attacker({socket,roomId}) {
    const [message,setMessage]=useState('');
    const [messageRecieved,setMessageRecieved]=useState('');
    const [selected,setSelected] = useState(0) ;
    const [next , setNext]=useState(false);

    const handleSelected = (id)=>{
        setSelected(id);
    }
    const sendMessage  = () =>{
      socket.emit("send_message",{message,roomId}); //since both key and value are same
    };
    const handleNext = ()=> {
        if(selected){
            setNext((state)=>true);
        }else{
            alert("Select option")
        }
    }


    useEffect(()=>{
        if(socket){
            socket.on("recieve_message",(data)=>{
            setMessageRecieved(data.message);
            })
        }
    },[socket])

  return (
    <div className='attacker'>
        {
        next===false?(
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
                            handleSelected={handleSelected}    
                            />
                        )
                    })
                }
            </div>
        </div>  ):(
                <div className='defense'>
                    <Quiz socket={socket} roomId={roomId} role={"Attacker"} selected={selected}/>
                </div>
            )
        
        }
        <div className='sideHUD' >
                <div className='chat' style={{color:"lightgreen"}}>

                <input placeholder='Message...' onChange={(event)=>{
                    setMessage(event.target.value);
                }}/>
                <button className='test-btn' onClick={sendMessage}>Send</button>
                <h2>Message:</h2>
                {messageRecieved}
                </div>
                <div className='goToQz' onClick={handleNext} >
                    <h3>Next    </h3>
                    Selected:{selected}
                </div>
            </div>
    </div>
  )
}
