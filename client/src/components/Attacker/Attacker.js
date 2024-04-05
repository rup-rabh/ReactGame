import React from 'react'
import AttackList from '../../Data/AttackList.json'
import "./Attacker.css"
import { useEffect,useState } from "react";
import Duel from '../Duel/Duel'
import GameAnalysis from '../gameAnalysis/GameAnalysis';
// const socket = io.connect("http://localhost:3001")

// id , name , description , cost
function AttackItem({item,handleSelected,duelClicked}){//

    return (
        <div className="attack-card" onClick={() =>{ if(!duelClicked)handleSelected(item.id)}}
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
    const [round,setRound] = useState(0);
    const [duelClicked,setDuelClicked] = useState(false);
    const [score,setScore]=useState([]);
    const [gameAnalysis, setGameAnalysis] = useState(null);
    const handleSelected = (id)=>{
        setSelected(id);
    }
    const sendMessage  = () =>{
      socket.emit("send_message",{message,roomId}); //since both key and value are same
    };

    const handleDuel = () =>{
        if(selected===0){ 
            alert('select option');
        }
        else{
            setDuelClicked(true);
            socket.emit('duel',{selected,round});
        }
    }
    const handleAnalysis = ()=>{
        socket.emit( "analysis",{});
    }

    useEffect(()=>{
        if(socket){
            socket.on("recieve_message",(data)=>{
            setMessageRecieved(data.message);
            })
            socket.on("analysisSend",(data)=>{
                // console.log(data);
                setGameAnalysis(data);
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
                            duelClicked={duelClicked}
                            />
                        )
                    })
                }
            </div>
            <Duel 
            score={score} 
            setScore={setScore} 
            socket={socket}
            round={round}
            setRound = {setRound}
            setDuelClicked={setDuelClicked}
            setNext = {setNext}
            next = {next}
            />

        </div>  ):(
            <div className='analysis'>

                <h1 >Game Over</h1>
                <button onClick={handleAnalysis}>Game Analysis</button>
                <GameAnalysis gameAnalysis={gameAnalysis}/>
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
                {
                    next===false?(

                <button className='goToQz' onClick={handleDuel} disabled={duelClicked}>
                    <h3>{round ===5? "Result": "Duel"}    </h3>
                    Selected:{selected}
                </button>
                
                    ):""
                }
                
            </div>
    </div>
  )
}
