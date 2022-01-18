// user time tracking
const axios = require('axios')

// Select Start & End button
const startBtn = document.querySelector('#start-btn')
const endBtn = document.querySelector('#end-btn')
// Set Interval ID
let intervalId ;
// let startRuntTime ;
(async function () {
  let {data} = await axios.get('/get-start-data')
  startRuntTime = data
  if (startRuntTime != 0) {
    const startNow = startRuntTime
    startCounting (startNow)
    startBtn.style.display ="none"
    endBtn.style.display ="inline"
  }
})()
// if (startRuntTime != 0) {
//   const startNow = startRuntTime
//   startCounting (startNow)
//   startBtn.style.display ="none"
//   endBtn.style.display ="inline"
// }
// Start button click event function
startBtn.addEventListener('click',async(event)=>{
  event.preventDefault()
  // Start button to Api call
  const {data} = await axios.post('/attendance-start')
  startCounting(data)
  startBtn.style.display ="none"
  endBtn.style.display ="inline"
})
// End button click event function
endBtn.addEventListener('click',async(event)=>{
  event.preventDefault()
  // Stop counting
  clearInterval(intervalId)
  document.getElementById('elapsedTime').textContent = "00:00:00"
  // End button to Api call
  const {data} = await axios.post('/attendance-end')
  startBtn.style.display ="inline"
  endBtn.style.display ="none"
  // Destructuring data
  const {getTodayData,todayTotalData, weekTotalData,getWeekData} = data
  console
  // Last index data
  lastData = getTodayData[getTodayData.length-1]
  weekData = getWeekData[getWeekData.length-1]
  // Update today history table
  todayHistory(lastData.start,lastData.end,lastData.total)
  weekHistory(weekData.date,weekData.start,weekData.end,weekData.total)
  const {todayTotal} = todayTotalData
  const {weekTotal} = weekTotalData
  // Set today total data 
  setTodayTotal(todayTotal)
  setWeekTotal(weekTotal)
})

 // Set today total data function
function setTodayTotal(data){
  const totalWorkTime = document.querySelector('#total-work-time')
  totalWorkTime.innerHTML = data
}
function setWeekTotal(data){
  const totalWorkTime = document.querySelector('#total-week-work-time')
  totalWorkTime.innerHTML = data
}
 // Today history table  Create element function
function todayHistory(start,end,total){
  const todayDetails = document.querySelector('#today-details')
  let details = document.createElement(
    "div");
    details.className = "details"
    details.innerHTML ="hello"
    let title = document.createElement(
      "div")
      title.className ="title"
      title.className ="hello world"
    let projectName =  document.createElement(
      "div")
      projectName.className = "project-name" 
      projectName.innerHTML ="hello world"
    let startTime =  document.createElement(
        "div")
        startTime.className = "start-time" 
        startTime.innerHTML =`${start}`
    let endTime =  document.createElement(
        "div")
        endTime.className = "end-time" 
        endTime.innerHTML =`${end}`
    let totals =  document.createElement(
      "div")
      totals.className = "total-work-time" 
      totals.innerHTML =`${total}`
    
    todayDetails.appendChild(details)
    details.appendChild(projectName)
    details.appendChild(startTime)
    details.appendChild(endTime)
    details.appendChild(totals)
}

// let d = new Date();
// let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
// let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
// let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
// console.log(`${da} ${mo} ${ye}`);

function toDayPrint(){
  let d = new Date();
let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${da} ${mo} ${ye}`
}
// const todayDetails = document.querySelector('#week-details')
//   console.log(todayDetails.lastElementChild.firstElementChild.innerHTML)

function weekHistory(todayDate,start,end,total){
  const weekDetails = document.querySelector('#week-details')
  let detailsElement= weekDetails.lastElementChild
   let titleElement=   detailsElement.getElementsByClassName('title')[0].innerHTML
  if(titleElement==todayDate){
    weekDetails.lastElementChild.remove()
  }
    // todayDetails.lastElementChild.remove()
  let details = document.createElement(
    "div");
    details.className = "details"
    let title = document.createElement(
      "div")
      title.className ="title"
      title.innerHTML =`${todayDate}`
    let projectName =  document.createElement(
      "div")
      projectName.className = "project-name" 
      projectName.innerHTML ="hello world"
    let startTime =  document.createElement(
        "div")
        startTime.className = "start-time" 
        startTime.innerHTML =`${start}`
    let endTime =  document.createElement(
        "div")
        endTime.className = "end-time" 
        endTime.innerHTML =`${end}`
    let totals =  document.createElement(
      "div")
      totals.className = "total-work-time" 
      totals.innerHTML =`${total}`
    
      weekDetails.append(details)
    details.appendChild(title)
    details.appendChild(projectName)
    details.appendChild(startTime)
    details.appendChild(endTime)
    details.appendChild(totals)
}

// Current time to start time difference function 
function startCounting (data){
  function seconds_to_days_hours_mins_secs_str(seconds) {
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
    function increment() {
      let elapsedTime = new Date() - new Date(data);
      document.getElementById('elapsedTime').textContent = seconds_to_days_hours_mins_secs_str(
        Math.round(elapsedTime / 1000).toString(),
      );
    }
  // get Set interval ID
   let ID = setInterval(increment,1000) 
   // interval ID
   intervalId = ID
}