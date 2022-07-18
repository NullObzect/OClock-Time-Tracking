import {
  aJAXPostRequest
} from './helper.js';
import Toastify from './toastify.js';

const timeNullToast = Toastify({
  text: 'Time not select',
  className: 'warning',
})
const successToast = Toastify({
  text: 'Time update successfully',
})

// for update start and end time

const updateStartTime = document.querySelectorAll('.update-start-time');
const updateEndTime = document.querySelectorAll('.update-end-time');
const updateBtn = document.querySelectorAll('.update-btn');
const saveBtn = document.querySelectorAll('.save-btn');
const updateStartTimeVal = document.querySelectorAll('.update-start-time-val');
const updateEndTimeVal = document.querySelectorAll('.update-end-time-val');
const userId = document.querySelectorAll('.userId');
const getDate = document.querySelectorAll('.get-date');
const saveBtnForEndTime = document.querySelectorAll('.save-btn-for-end-time');
const optCancelBtn = document.querySelectorAll('.opt-cancel-btn');

//
for (let i = 0; i < updateStartTime.length; i++) {
  updateBtn[i].addEventListener('click', () => {
    updateBtn[i].style.display = 'none';
    updateStartTime[i].style.display = 'block';
    updateEndTime[i].style.display = 'block';
  });
}
for (let i = 0; i < updateStartTime.length; i++) {
  updateStartTime[i].addEventListener('click', () => {
    updateStartTime[i].style.display = 'none';
    updateEndTime[i].style.display = 'none';
    saveBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'block';
    // updateStartTimeVal[i].type = 'time';
    updateStartTimeVal[i].focus();
  });
  saveBtn[i].addEventListener('click', () => {
    if (updateStartTimeVal[i].value === '') {
      timeNullToast.showToast();
      updateStartTimeVal[i].focus();
    }
    const data = {
      userId: userId[i].value,
      startTime: updateStartTimeVal[i].value,
      date: getDate[i].value,
    }
    console.log(data);
    aJAXPostRequest('/update-start-time', data)
    saveBtn[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
  });
}

// update end time
for (let i = 0; i < updateEndTime.length; i++) {
  updateEndTime[i].addEventListener('click', () => {
    updateEndTime[i].style.display = 'none';
    saveBtnForEndTime[i].style.display = 'block';
    updateStartTime[i].style.display = 'none';
    optCancelBtn[i].style.display = 'block';
    // updateEndTimeVal[i].type = 'time';
    updateEndTimeVal[i].focus();
    const data = {
      userId: userId[i].value,
      endTime: updateEndTimeVal[i].value,
      date: getDate[i].value,
    }
    console.log(data);
  });
  saveBtnForEndTime[i].addEventListener('click', () => {
    if (updateEndTimeVal[i].value === '') {
      alert('Please enter end time');
      updateEndTimeVal[i].focus();
    }
    const data = {
      userId: userId[i].value,
      endTime: updateEndTimeVal[i].value,
      date: getDate[i].value,
    }
    console.log(data);
    aJAXPostRequest('/update-end-time', data)
    saveBtnForEndTime[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    return window.location.reload();
  });
}
// when click on cancel button
for (let i = 0; i < optCancelBtn.length; i++) {
  optCancelBtn[i].addEventListener('click', () => {
    updateBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    saveBtn[i].style.display = 'none';
    saveBtnForEndTime[i].style.display = 'none';
  });
}
