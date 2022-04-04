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
const showCurrentTime = document.querySelector('.current-time');
const time = document.querySelector('.time');
const timeMeridiem = document.querySelector('.time-meridiem');

// showCurrentTime.getElementsByTagName("span")[0].textContent = "dd";
currentDate.innerText = getCurrentDate();
// showCurrentTime.innerText = clock().slice(0, 5);
time.innerText = clock().slice(0, 5);
timeMeridiem.textContent = clock().slice(6, 8);
console.log(clock().slice(6, 8));
console.log(timeMeridiem.textContent);

// update end time
document.addEventListener('DOMContentLoaded', () => {
  console.log('update end time');
  const updateEndTimeModal = document.getElementsByClassName('modal-cont');
  const updateBtn = document.getElementsByClassName('dashboard-update-btn');
  console.log(updateBtn);

  for (let i = 0; i < updateBtn.length; i++) {
    updateBtn[i].addEventListener('click', () => {
      updateEndTimeModal[i].style.display = 'block';
    });
  }

  const closeBtn = document.getElementsByClassName('modal-close-btn');

  for (let j = 0; j < closeBtn.length; j++) {
    closeBtn[j].addEventListener('click', () => {
      console.log('close');
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
    console.log(data);
    aJAXPostRequest('/update-start-time', data)
    saveBtn[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
  });
}

// update end time
for (let i = 0; i < updateEndTime.length; i++) {
  updateEndTime[i].addEventListener('click', () => {
    updateEndTime[i].style.display = 'none';
    saveBtnForEndTime[i].style.display = 'block';
    updateStartTime[i].style.display = 'none';
    updateEndTimeVal[i].type = 'time';
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
    return window.location.replace('/dashboard');
  });
}

//  AJAX post request function
// const aJAXPostRequest = (url, values) => new Promise((resolve, reject) => {
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(values),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log({ data });
//       if (data.success) {
//         alert('Option Value Updated');
//       }
//     })
//     .catch((err) => console.log(err));
//   // return window.location.replace('/options/holiday');
// })
