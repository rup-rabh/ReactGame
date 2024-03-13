import React, { useState } from 'react'
import './Board.css' ;
function Board() {
  const [role, setRole] = useState(null);
  const chosenRole =(role)=>{
    console.log(role);
      // setRole(role);
  }

  if(!role)  {
    
    return (
      <div className='board'>
          
        <h1>Welcome to the game of  </h1>
        <h1>Strategic interaction between Attacker and Defender in Cyber-Security</h1>
        <p className='qry'>You are playing as: </p>
        <div  className='chooseRole'>
              <button className='attackBtn' onClick={()=>{chosenRole('Attacker')}}>Attacker</button>
              <button  className='defendBtn' onClick={()=>{chosenRole('Defender')}}>Defender</button>
        </div>
      
        <br/><hr/>

      </div>
      )
    }
    return(
      <>
        {
          // role === "Attacker" ? 
            // <Attacker /> : <Defender />
        }
      </>
    );



}
  
  export default Board
  