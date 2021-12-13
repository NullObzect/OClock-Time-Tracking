const Formater = {
  timeToHour: (time) => {
    if (time == null) {
      return '00hr 00m'
    }
    const s = time.split(':')
    const hour = `${s[0]}hr`
    const minutes = `${s[1]}m`
    const result = `${hour} ${minutes}`
    return result
  },
  // functin for total time count

  calculateTime: (fixedTime, workingTotalSec) => {
    const getFixedSec = Number(fixedTime * 60 * 60);
    let getTotalSec = getFixedSec - workingTotalSec
    getTotalSec = getFixedSec === 0 ? workingTotalSec - getFixedSec : getFixedSec - workingTotalSec

    const hours = Math.floor(getTotalSec / 3600);
    getTotalSec %= 3600;
    const minutes = Math.floor(getTotalSec / 60);
    const seconds = getTotalSec % 60;

    return `${hours}:${minutes}:${seconds}`
  },
  //  function for date formater
  dateFormate: (dateTime) => {
    const today = new Date(dateTime)
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
    const getDate = `${year}-${month}-${day}`;

    return getDate;
  },
}

module.exports = Formater
