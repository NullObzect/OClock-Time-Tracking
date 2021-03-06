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
const getCurrentDate = () => {
  const date = new Date();
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };
  return date.toLocaleDateString('en-us', options);
};
const clock = () => {
  const date = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleTimeString('en-us', options);
};

const currentDate = document.querySelector('.current-date');
// const showCurrentTime = document.querySelector('.current-time');
const time = document.querySelector('.time');
const timeMeridiem = document.querySelector('.time-meridiem');

// showCurrentTime.getElementsByTagName("span")[0].textContent = "dd";
currentDate.innerText = getCurrentDate();
// showCurrentTime.innerText = clock().slice(0, 5);
setInterval(() => {
  time.innerText = clock().slice(0, 5);
  timeMeridiem.textContent = clock().slice(6, 8);
}, 1000);


// update end time
document.addEventListener('DOMContentLoaded', () => {
  const updateEndTimeModal = document.getElementsByClassName('modal-cont');
  const updateBtn = document.getElementsByClassName('home-update-btn');

  for (let i = 0; i < updateBtn.length; i++) {
    updateBtn[i].addEventListener('click', () => {
      updateEndTimeModal[i].style.display = 'block';
    });
  }

  const closeBtn = document.getElementsByClassName('modal-close-btn');

  for (let j = 0; j < closeBtn.length; j++) {
    closeBtn[j].addEventListener('click', () => {
     
      updateEndTimeModal[j].style.display = 'none';
    });
  }
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
    updateStartTimeVal[i].type = 'time';
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
    updateEndTimeVal[i].type = 'time';
    updateEndTimeVal[i].focus();
    const data = {
      userId: userId[i].value,
      endTime: updateEndTimeVal[i].value,
      date: getDate[i].value,
    }
  
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

    aJAXPostRequest('/update-end-time', data)
    saveBtnForEndTime[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    return window.location.replace('/home');
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
