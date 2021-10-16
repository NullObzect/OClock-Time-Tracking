// user time tracking
const getDay = new Date()

function dateTimeFormate(dateTime) {
  const today = dateTime

  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const day = today.getDate()
  const hour = today.getHours() < 10 ? `0${today.getHours()}` : today.getHours()
  const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes()
  const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds()
  const timeStamps = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
  return timeStamps
}
const dataBase = new Date('2021-10-14 23:31:49')
console.log('dat', dataBase);
console.log('present', new Date())
console.log('result', new Date() - dataBase)
const nowTime = dateTimeFormate(new Date())
console.log('formate', nowTime)

function increment() {
  let elapsedTime = Date.now() - dataBase;
  // document.getElementById('elapsedTime').textContent = seconds_to_days_hours_mins_secs_str(Math.round(elapsedTime / 1000).toString())
  elapsedTime = seconds_to_days_hours_mins_secs_str(Math.round(elapsedTime / 1000).toString())
  // console.log(elapsedTime)
}
setInterval(increment, 1000)

function seconds_to_days_hours_mins_secs_str(seconds) {
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  const minutes = Math.floor(seconds / (60));
  seconds -= minutes * (60);
  return (`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
}
console.log(dateTimeFormate(getDay))
//
const startTime = document.getElementById('startTime')
const endTime = document.getElementById('endTime')

startTime.value = dateTimeFormate(getDay);
endTime.value = dateTimeFormate(getDay);

const startBtn = document.getElementById('start-btn')
const endBtn = document.getElementById('end-btn')
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  endBtn.style.display = 'block';
})

endBtn.addEventListener('click', () => {
  startBtn.style.display = 'block';
  endBtn.style.display = 'none';
})