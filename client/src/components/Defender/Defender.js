import React from 'react'
import "./Defender.css"
import DefenseList from "../../Data/DefendList.json"
import { useEffect,useState } from "react";
// import io from 'socket.io-client'    
import Quiz from '../Quiz/Quiz';

// const socket = io.connect("http://localhost:3001")
function DefenseItem({item,handleSelected}){

    return (
        <div className="defense-card" onClick={() =>handleSelected(item.id)}
        > 
            <div className='name'><h3>{item.id}. Name : {item.name}</h3></div>
            <div className='description'>description: <p>
                {item.description}
                </p></div>
            <div className='cost'>Cost : {item.cost}</div>
        </div>
    )
}
function Defender({socket,roomId}) {

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
        <div className='defender'>
            {
                next===false?(
            <div>
                <h1>Defender Intro: </h1>
                <p>Choose your Defense type</p>
                <div className='defense'>
                    {
                        DefenseList.map((item)=>{
                            return(
                                <DefenseItem 
                                key={item.id} 
                                item = {item}
                                handleSelected={handleSelected}
                                />
                            )
                        })
                    }
                </div>
            </div>):(
                <div className='defense'>
                    <Quiz socket={socket} roomId={roomId} role={"Defender"} selected={selected}/>
                </div>
            )
                }
            <div className='sideHUD' >
                <div className='chat' style={{color:"lightgreen"}}>

                <input placeholder='Message...' onChange={(event)=>{
                    setMessage(event.target.value);
                }}/>

                <button className='test-btn' onClick={sendMessage}>Send</button>
                <h4>Message:</h4>
                {messageRecieved}
                </div>

                {
                    next===false?(

                <div className='goToQz' onClick={handleNext} >
                    <h3>Next    </h3>
                    Selected:{selected}
                </div>
                    ):""
                }
            </div>
        </div>
      )
}

export default Defender
