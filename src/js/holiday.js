/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
import Toastify from './toastify';

import {
  aJAXPostRequest, dateDiff, dateFormate, formValidation, getCurrentDate
} from './helper';

const dateSelectWarn = Toastify({
  text: 'Date not select',
  className: 'info',
})

const baseUrl = process.env.BASE_URL

const actionBtn = document.querySelectorAll('.action-btn');
const updateBtn = document.querySelectorAll('.update-btn');
const deleteBtn = document.querySelectorAll('.delete-btn');
const saveBtn = document.querySelectorAll('.save-btn');
const optCancelBtn = document.querySelectorAll('.opt-cancel-btn');
//
const titleValue = document.querySelectorAll('.title-value');
const startDateValue = document.querySelectorAll('.start-date-value');
const endDateValue = document.querySelectorAll('.end-date-value');
const holidayId = document.querySelectorAll('.holiday-id');
const duration = document.querySelectorAll('.duration');

//
for (let i = 0; i < actionBtn.length; i++) {
  actionBtn[i].addEventListener('click', async () => {
    updateBtn[i].style.display = 'block';
    deleteBtn[i].style.display = 'block';
    actionBtn[i].style.display = 'none';
  });
}
for (let i = 0; i < updateBtn.length; i++) {
  updateBtn[i].addEventListener('click', () => {
    updateBtn[i].style.display = 'none';
    deleteBtn[i].style.display = 'none';
    saveBtn[i].style.display = 'block';
    actionBtn[i].style.display = 'none';
    optCancelBtn[i].style.display = 'block';
    titleValue[i].focus();
  });
}

// when save button is clicked
for (let i = 0; i < saveBtn.length; i++) {
  saveBtn[i].addEventListener('click', () => {
    const title = titleValue[i].value.trim();
    const start = startDateValue[i].value.trim();
    const end = endDateValue[i].value.trim();
    const id = holidayId[i].value;
    if (title === '' || start === '' || end === '' || id === '') {
      alert('Please fill all the fields');
      return;
    }
    const data = {
      title,
      start,
      end,
      id,
    };

    aJAXPostRequest('/options/holiday/edit/holiday', data);
    titleValue[i].value = data.title;
    startDateValue[i].value = data.start;
    endDateValue[i].value = data.end;
    duration[i].innerText = `${dateDiff(data.start, data.end)} day`;
    saveBtn[i].style.display = 'none';
    actionBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
  });
}

// when cancel button is clicked
for (let i = 0; i < optCancelBtn.length; i++) {
  optCancelBtn[i].addEventListener('click', () => {
    saveBtn[i].style.display = 'none';
    actionBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
  });
}

function iconCheck() {
  const dateIcon = document.querySelector('#date-icon')
  const data = dateIcon.classList.contains('date-icon-active')
  if (data) {
    return dateIcon.classList.remove('date-icon-active')
  }
}

document.getElementById('startPicker').addEventListener('blur', () => {
  iconCheck()
})
document.getElementById('endPicker').addEventListener('blur', () => {
  iconCheck()
})

// action buttons
const dateIcon = document.querySelector('#date-icon');

dateIcon.addEventListener('click', async () => {
  const dateStart = document.querySelector('#startPicker').value
  const startDate = dateFormate(startDatePicker.getFullDate())
  const endDate = dateFormate(endDatePicker.getFullDate() || getCurrentDate())

  if (dateStart === '') {
    return dateSelectWarn.showToast()
  }

  window.location = `${baseUrl}/options/holiday?startDate=${startDate || dateStart}&endDate=${endDate}`
})
formValidation()
