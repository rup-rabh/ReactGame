import React, { useState,useEffect } from 'react'
import './Board.css' ;
import Attacker from '../Attacker/Attacker'
import Defender from '../Defender/Defender'
import io from 'socket.io-client'

function Board() {
  const [socket,setSocket] = useState(null);
  const [role, setRole] = useState(null);
  const[roomId,setRoomId]=useState(null); 
  const chosenRole =(role)=>{
    if(roomId){
      setRole(role);
      
    }else{
      alert('First Join or Create room')
    }
  }
  useEffect(()=>{
    const newSocket = io.connect("http://localhost:3001");
    setSocket(newSocket);
  },[])
  const handleCreateRoom=(roomNo)=>{
    if(roomNo){
    // console.log(roomNo);
    socket.emit('join_room',{room: roomId , role});
  }
    else{
      alert("Enter room number")
    }
  }
  const handleJoinRoom=(roomNo)=>{
    if(roomNo){
      // console.log(roomNo);
      socket.emit('join_room',{room: roomId , role});
    }
      else{
        alert("Enter room number")
      }
  }

  if(!role || !roomId)  {
    return (
      <div className='board'>
          
        <h1>Welcome to the game of  </h1>
        <h1>Strategic interaction between Attacker and Defender in Cyber-Security</h1>
        <div className='room'>
          <input placeholder='Enter Room ID' onChange={(event)=>setRoomId(event.target.value)} />
          <div className='roomButtons'>
              <button onClick={()=>handleJoinRoom(roomId)}>Join Room</button>
              <button onClick={()=>handleCreateRoom(roomId)}>Create Room</button>
          </div>
        </div>
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
            <Attacker socket={socket} roomId={roomId}/> : <Defender socket={socket} roomId={roomId}/>
        }
      </div>
    );
}
  
  export default Board
  