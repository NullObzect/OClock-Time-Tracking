// user time tracking

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

if (startTimeShow != 0) {
  const startNow = startTimeShow
  function increment() {
    let elapsedTime = new Date() - new Date(startNow);
    document.getElementById('elapsedTime').textContent = seconds_to_days_hours_mins_secs_str(
      Math.round(elapsedTime / 1000).toString(),
    );
    elapsedTime = seconds_to_days_hours_mins_secs_str(
      Math.round(elapsedTime / 1000).toString(),
    );
  }
  setInterval(increment, 1000);

  function seconds_to_days_hours_mins_secs_str(seconds) {
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
}
