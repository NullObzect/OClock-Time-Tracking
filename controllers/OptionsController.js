/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */

const OptionsModel = require('../models/OptionsModel')
const userModel = require('../models/UserModel')
const LeaveModel = require('../models/LeaveModel')
const LogModel = require('../models/LogModel')

const OptionsController = {

  getOptionsList: async (req, res) => {
    res.render('pages/options')
  },
  getOptionValues: async (req, res) => {
    const optionList = await OptionsModel.options()
    const leaveTypeList = await LeaveModel.leaveTypeList()
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

    res.render('pages/option-values', { optionList, leaveTypeList })
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
  getUpdateOptionValues: async (req, res) => {
    try {
      console.log('req body', req.body);

      const { optionId, optionValue } = req.body;
      const regEx = /^\d+$/
      // for update name
      if (optionValue[0] === 'F' || optionValue[0] === 'S' || optionValue[0] === 'M' || optionValue[0] === 'T' || optionValue[0] === 'W') {
        const isUpdate = await OptionsModel.updateOptionValue(getDayNameToNum(optionValue), optionId)
      } if (optionValue[0] !== 'F') { // for update time
        const isUpdate = await OptionsModel.updateOptionValue(time12HrTo24Hr(optionValue), optionId)
      } if (optionValue.match('Hours') == 'Hours') { // for update fixed time
        const isUpdate = await OptionsModel.updateOptionValue(hrToTime(optionValue), optionId)
        console.log('yes update fixed time');

        if (isUpdate.errno) {
          res.send('Error')
        } else {
          res.status(200).json({
            msg: 'success',
          })
        }
      } if (regEx.test(optionValue)) { // for update fixed time
        const isUpdate = await OptionsModel.updateOptionValue(optionValue, optionId)

        if (isUpdate.errno) {
          res.send('Error')
        } else {
          res.status(200).json({
            msg: 'success',
          })
        }
      }

      // when update option value

      const [{ inTime }] = await LogModel.getOptionsValueForUpdateInTime()
      const [{ outTime }] = await LogModel.getOptionsValueForUpdateOutTime()
      const [{ fixedTime }] = await LogModel.getOptionsValueForUpdateFixedTime()
      const getValues = await LogModel.ifOptionValueIsUpdated()
      console.log({ getValues });

      if (getValues.length > 0) {
        for (let i = 0; i < getValues.length; i += 1) {
          if (inTime != getValues[i].logInTime || outTime != getValues[i].logOutTime || fixedTime != getValues[i].logFixedTime) {
            await LogModel.updateForLogValues(inTime, outTime, fixedTime, getValues[i].logId)
            console.log('updated');
          }
        }
      }
      res.status(200).json({
        msg: 'success',
      })
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
  Thu: 3,
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
