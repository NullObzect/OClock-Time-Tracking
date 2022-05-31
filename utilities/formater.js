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
    if (fixedTime === null || workingTotalSec === null) return null;
    const getFixedSec = Number(fixedTime * 60 * 60);
    let getTotalSec = getFixedSec - workingTotalSec
    getTotalSec = getFixedSec === 0 ? workingTotalSec - getFixedSec : getFixedSec - workingTotalSec

    const hours = Math.floor(getTotalSec / 3600);
    getTotalSec %= 3600;
    const minutes = Math.floor(getTotalSec / 60);
    const seconds = getTotalSec % 60;

    return `${hours}:${minutes}:${seconds}`
  },
  //  function for date formate
  dateFormate: (dateTime) => {
    const today = new Date(dateTime)
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
    const getDate = `${year}-${month < 10 ? `0${month}` : month}-${day}`;

    return getDate;
  },
  // function for working hour
  timeFormateForReport: (time) => {
    if (time == null) {
      return ' '
    }
    const s = time.split(':')
    const hour = `${s[0]}`
    const isZero = hour[0]
    const minutes = `${s[1]}`
    const result = `${isZero === '0' ? hour.replace(isZero, ' ') : hour}:${minutes}`

    return result
  },

  workHourFormateForReport: (time) => {
    if (time === null || time === undefined) return ''

    const s = time.split(':')

    const hour = `${s[0]}`

    const isZero = hour[0] === undefined ? ' ' : hour[0]

    const minutes = `${s[1]}`

    const result = `${isZero === '0' ? hour.replace(isZero, ' ') : hour}:${minutes}`

    const mintIsZeor = result.slice(2, 5)

    const withOutZeroResult = result.replace(mintIsZeor, ' ')

    return (mintIsZeor === ':00') ? withOutZeroResult : result;
  },

  timeToHourWithoutMint: (time) => {
    if (time == null) {
      return ''
    }
    const s = time.split(':')
    const hour = `${s[0]}`
    const isZero = hour[0]
    const result = `${isZero === '0' ? hour.replace(isZero, ' ') : hour}`

    return result
  },
  timeFormatForUpdateTime: (time) => {
    if (time === null || time === undefined) return ''
    const s = time.split(':')
    const hour = `${s[0]}`
    const minutes = `${s[1]}`
    const result = `${hour}:${minutes}`
    return result;
  },
  // function for date diff
  dateDiff: (dateOne, dateTwo) => {
    const date1 = new Date(dateOne);
    const date2 = new Date(dateTwo);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  },
  stringToNumber: (s) => {
    if (s.length > 0) {
      return s.replace(/,/, ',')
    }
    return ''
  },

  time12HrTo24Hr: (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours > '12') {
      return hours = '00:00';
    }
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  },

  time24HrTo12Hr: (time) => {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    // return adjusted time or original string
    const getTime = time.join('')
    if (getTime.length === 7) {
      return `0${getTime}`
    }
    return `${getTime}`;
  },

}

module.exports = Formater
