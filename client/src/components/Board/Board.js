import React, { useState,useEffect } from 'react'
import './Board.css' ;
import Attacker from '../Attacker/Attacker'
import Defender from '../Defender/Defender'
import io from 'socket.io-client'

function Board() {
  const [socket,setSocket] = useState(null);
  const [role, setRole] = useState(null);
  const chosenRole =(role)=>{
      setRole(role);
  }
  useEffect(()=>{
    const newSocket = io.connect("http://localhost:3001");
    setSocket(newSocket);
  },[])

  if(!role)  {
    return (
      <div className='board'>
          
        <h1>Welcome to the game of  </h1>
        <h1>Strategic interaction between Attacker and Defender in Cyber-Security</h1>
        <p className='qry'>You are playing as: </p>
        <div  className='chooseRole'>
              <button className='attackBtn rolebtn' onClick={()=>{chosenRole('Attacker')}}>Attacker</button>
              <button  className='defendBtn rolebtn' onClick={()=>{chosenRole('Defender')}}>Defender</button>
        </div>
        <br/><hr/>
      </div>
      )
    }
    return(
      <div className='board'>
        {
          role === "Attacker" ? 
            <Attacker socket={socket}/> : <Defender socket={socket}/>
        }
      </div>
    );
}
  
  export default Board
  