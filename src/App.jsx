import { useEffect, useState, useRef } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeMute, faPlay, faPause, faPlus, faMinus, faClockRotateLeft, faStopwatch } from '@fortawesome/free-solid-svg-icons'; 

function App() {
    const [sessionType, setSessionType] = useState("focus"); // this can be set to break or working
    const [sessionLength, setSessionLength] = useState(25);
    const [breakLength, setBreakLength] = useState(5);
    const [minutes, setMinutes] = useState(sessionLength);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isAlarming, setIsAlarming] = useState(false);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const [started, setStarted] = useState(false);
    
//when the timer is paused and the session length changes before it has begun,
// the time needs to update, you can't change the break or session length once it's started
useEffect(()=>{
  if(!isActive && !started){
    if(sessionType==="focus"){
    setMinutes(sessionLength);
    setSeconds(0);
    }
}
}, [sessionLength, isActive, started, sessionType]);
useEffect(()=>{
  if(!isActive){
    if(sessionType==="break"){
    setMinutes(breakLength);
    setSeconds(0);
    }
}
}, [breakLength, isActive, sessionType]);



//rerender every second to update the time
    useEffect(() => {
      if (isActive) {
        timerRef.current = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds === 0) {
                    setMinutes((prevMinutes) => {
                        if (prevMinutes === 0) {
                          //the timer goes off
                            if (sessionType === "focus") {
                                setIsAlarming(true);
                                audioRef.current.play();
                                setSessionType("break");
                                //hardcoded bc of error where reset is adding one
                                return breakLength - 1; 
                            } else {
                                setSessionType("focus");
                                return sessionLength - 1;
                            }
                        } else {
                          //update minutes
                            return prevMinutes - 1;
                        }
                    });
                    //update seconds
                    return 59;
                } else {
                    return prevSeconds - 1;
                }
            });
        }, 1000);
    } else if (!isActive && timerRef.current) {
        clearInterval(timerRef.current);
    }
    //reset the interval
    return () => clearInterval(timerRef.current);
}, [isActive, sessionType, sessionLength, breakLength]);
//button handler functions
 function onBreakPlusClick(){
  if((breakLength+1) === 60) return;
  else{
  setBreakLength(breakLength + 1);
  }
 }
 function onBreakMinusClick(){
  if((breakLength-1) === 0) return;
  else{
  setBreakLength(breakLength - 1);
  }
 }
 function onSessionPlusClick(){
  if((sessionLength+1) === 60) return;
  else{
  setSessionLength(sessionLength + 1);
  }
 }
 function onSessionMinusClick(){
  if((sessionLength-1) === 0) return;
  else{
  setSessionLength(sessionLength - 1);
  }
 }
 //this function is set to fcc cert requirements
 //when I update it, I won't have it reset to 25 and 5 also
 //won't have it change the session type so you can reset breaks
 function resetCount(){
  setSessionType("focus");
  setStarted(false);
  setMinutes(25);
  setSeconds(0);
  setBreakLength(5);
  setSessionLength(25);
  setIsActive(false);
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
 }

 function startStopCountDown(){
  if(!started) {setStarted(true)};
  setIsActive((previsActive) => !previsActive);
 }
function mute(){
  if(isAlarming){
    audioRef.current.pause();
    setIsAlarming(false);
  }
  else{
    setIsAlarming(true);
    audioRef.current.play();
  }
}
  return (
      <div>
      <audio id="beep" ref={audioRef} src="/chiptune-alarm-clock-112869.mp3"></audio>
        <h1>Pomodoro Timer <FontAwesomeIcon icon={faStopwatch}/></h1>
        <div id="controls">
          <button style={{visibility: isAlarming ? 'visible': 'hidden'}} onClick={mute}><FontAwesomeIcon icon={faVolumeMute} /></button>
          <button id="start-stop" onClick={startStopCountDown}>{started ? (!isActive ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />) : "Start"}</button>
          <button id="reset" onClick={resetCount}><FontAwesomeIcon icon={faClockRotateLeft} />Reset</button>
        </div>
        <p id="time-left"> {minutes < 10 ? "0"+minutes : minutes}:{seconds < 10 ? "0"+seconds : seconds}</p><p id="timer-label"><u>{sessionType==="focus" ? "Focus" : "Chill"}</u> Time </p>
       
        <div id="container">
          <div id="break">
            <p id="break-label">Break Length: </p><p id="break-length">{breakLength}</p>
            <button id="break-increment" onClick={onBreakPlusClick}><FontAwesomeIcon icon={faPlus} /></button>
            <button id="break-decrement" onClick={onBreakMinusClick}><FontAwesomeIcon icon={faMinus} /></button>
          </div>
          <div id="session">
            <p id="session-label">Session Length: </p><p id="session-length">{sessionLength}</p>
            <button id="session-increment" onClick={onSessionPlusClick}><FontAwesomeIcon icon={faPlus} /></button>
            <button id="session-decrement" onClick={onSessionMinusClick}><FontAwesomeIcon icon={faMinus} /></button>
          </div>
        </div>
    </div>
  )
}

export default App

//ideas-> change mute button to a sound button when pressed, have a hasalarmed property, 
//add volume control
//change background color for break vs session