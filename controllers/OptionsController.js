const OptionsModel = require('../models/OptionsModel')
const userModel = require('../models/UserModel')

const OptionsController = {

  getOptionsList: async (req, res) => {
    res.render('pages/options')
  },
  getOptionValues: async (req, res) => {
    const optionList = await OptionsModel.options()
    // console.log({ optionList })
    optionList.forEach((el) => {
      if (el.option_title === 'in-time') {
        console.log(el.option_value)
        el.option_value = time24HrTo12Hr(el.option_value)
      }
      if (el.option_title === 'out-time') {
        el.option_value = time24HrTo12Hr(el.option_value)
      }
      if (el.option_title === 'off-day') {
        el.option_value = getNumToDay(el.option_value)
      }
      if (el.option_title === 'fixed time') {
        el.option_value = timeToHr(el.option_value)
      }
    })
    // console.log({ optionList })

    res.render('pages/option-values', { optionList })
  },
  getProjects: async (req, res) => {
    try {
      const projects = await OptionsModel.getProjects()
      res.render('pages/projects', { projects })
    } catch (error) {
      console.log(error)
    }
  },
  createProject: async (req, res) => {
    const { name, details } = req.body
    try {
      await OptionsModel.createProject(name, details)
      req.flash('success', 'Project Create Successfully')
      res.redirect('/options/projects')
    } catch (error) {
      console.log('', error);
    }
  },

  getNotice: async (req, res) => {
    const { user } = req
    if (user.user_role === 'admin') {
      const users = await userModel.getAllUsersList()
      const notices = await OptionsModel.getAllNotice()
      res.render('pages/notice', { users, notices, user })
    } else {
      const notices = await OptionsModel.userNotice(user.id)
      res.render('pages/notice', { notices, user })
    }
  },
  sendNotice: async (req, res) => {
    const { userId, noticeDetails } = req.body
    try {
      const result = await OptionsModel.sendNotice(userId, noticeDetails)
      console.log(result)
      res.redirect('/options/notice')
    } catch (error) {
      console.log(error)
    }
  },
  contactAdmin: async (req, res) => {
    const { userId, noticeDetails } = req.body
    const { user } = req
    const senderId = user.id
    const result = await OptionsModel.contactAdmin(userId, senderId, noticeDetails)
    res.redirect('/options/notice')
  },
  getUpdateOptionValues: async (req, res) => {
    try {
      console.log(req.body);

      const { optionId, optionValue } = req.body;
      console.log(optionId, optionValue);

      if (optionValue[0] === 'F' || optionValue[0] === 'S' || optionValue[0] === 'M' || optionValue[0] === 'T' || optionValue[0] === 'W') {
        const isUpdate = await OptionsModel.updateOptionValue(getDayNameToNum(optionValue), optionId)
        if (isUpdate.errno) {
          res.send('Error')
        } else {
          res.redirect('/options')
        }
      } if (optionValue[0] !== 'F') {
        const isUpdate = await OptionsModel.updateOptionValue(time12HrTo24Hr(optionValue), optionId)
        if (isUpdate.errno) {
          res.send('Error')
        } else {
          res.redirect('/options')
        }
      } if (checkInputFixedHr(optionValue) === true) {
        const isUpdate = await OptionsModel.updateOptionValue(hrToTime(optionValue), optionId)
        if (isUpdate.errno) {
          res.send('Error')
        } else {
          res.redirect('/options')
        }
      }

      // console.log('xxx', optionValue);
      // const isUpdate = await OptionsModel.updateOptionValue(time12HrTo24Hr(optionValue), optionId)
      // if (isUpdate.errno) {
      //   res.send('Error')
      // } else {
      //   res.redirect('/options')
      // }
    } catch (err) {
      console.log('====>Error form OptionsController updateOptionValues', err);
    }
  },
  getUpdateProject: async (req, res) => {
    try {
      console.log('adsfasdf', req.body);

      const { pName, pDetails, pId } = req.body
      const isUpdate = await OptionsModel.updateProjectValue(pName, pDetails, pId)
      if (isUpdate.errno) {
        res.send('Error')
      } else {
        res.redirect('/options/projects')
      }
    } catch (err) {
      console.log('====>Error form', err);
    }
  },
  getDeleteProject: async (req, res) => {
    try {
      const { id } = req.params
      console.log(id);
      console.log('hello delete')

      const isDelete = await OptionsModel.deleteProject(id)
      if (isDelete.errno) {
        res.send('Error')
      } else {
        res.redirect('/options/projects')
      }
    } catch (err) {
      console.log('====>Error form', err);
    }
  },

}

// helper function
//
function time12HrTo24Hr(timeStr) {
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
}
function time24HrTo12Hr(time) {
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
}

// for  off day
const offDaysObj = {
  Fri: 4,
  Sat: 5,
  Sun: 6,
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thr: 3,
}
function numToDay(obj, num) {
  return Object.keys(obj).find((key) => obj[key] === num)
}
function dayToNum(obj, name) {
  return obj[name]
}
// console.log(numToDay(offDaysObj, 4))

function getNumToDay(num) {
  const dayName = []
  num.split(',').forEach((el) => {
    dayName.push(numToDay(offDaysObj, Number(el)))
  })
  return dayName.toString()
}
//

function getDayNameToNum(names) {
  const dayNum = []
  names.split(',').forEach((el) => {
    console.log({ el })
    dayNum.push(dayToNum(offDaysObj, el))
    // console.log(dayNum)
  })
  return dayNum.toString()
}

//

function hrToTime(hr) {
  const regEx = /\d+/
  const getHr = hr.match(regEx).join()
  if (getHr.length > 3) {
    return `0${hr}`
  }
  if (getHr < 10) {
    return `0${getHr}:00`
  } {
    return `${getHr}:00`
  }
}

// console.log(hrToTime('8 hr'))

function timeToHr(time) {
  const regEx = /\d+/
  const getHr = time.match(regEx)
  const res = getHr.join()
  const finalRes = res[0] === '0' ? res.slice(1) : res
  return `${finalRes} Hours`;
}
// console.log(timeToHr('8:00'))

function checkInputFixedHr(hr) {
  const matchHr = 'Hours'

  const getHr = hr.includes(matchHr)
  return getHr
}

module.exports = OptionsController
