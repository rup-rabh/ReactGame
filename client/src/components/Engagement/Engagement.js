import React, { useEffect, useState } from 'react';
import './Engagement.css';

export default function Engagement({ socket }) {
    const [score, setScore] = useState(null);
    const [countDown, setCountDown] = useState(null);
    const [winner, setWinner] = useState(null); // New state for the winner

    let intervalId;

    const startInterval = () => {
        intervalId = setInterval(() => {
            setCountDown(prevCountDown => {
                if (prevCountDown <= 0) {
                    socket.emit("showResult", {});
                    clearInterval(intervalId);
                    return 0;
                } else {
                    console.log(prevCountDown);
                    return prevCountDown - 1;
                }
            });
        }, 1000);
    };

    if (countDown === 5) {
        startInterval();
    }

    useEffect(() => {
        socket.on('showScore', (data) => {
            setScore(data.score);
        });
        socket.on('startCountdown', (data) => {
            setCountDown(5);
            console.log("countdown triggered");
        });
        socket.on('showWinP', (data) => {
            if (data.status === 1) {
                setWinner(data.winP); // Update winner state
                // alert(data.winP);
            } else {
                alert("Rival has not submitted yet");
            }
        });

        // Clean up on unmount
        return () => {
            socket.on('showScore');
            socket.on('startCountdown');
            socket.on('showWinP');
        };
    }, [socket]);

    return (
        <div className='engagement'>
            <h1>RESULT</h1>
            {
                score !== null && <div className='para'>Your score is {score}</div>
            }
            {
                countDown !== null && <div className='countDown'>Countdown<br></br> <p id='cnt'>{countDown}</p> </div>
            }
            {
                (winner!= null && winner>50) && <div className='finWin'>You are Winner,win score %:  {winner}</div> // Display winner if available
            }
            {
                (winner!= null && winner<=50) && <div className='finLos'>Sorry! you lost, score %:  {winner}</div>
            }
        </div>
    );
}
