/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import {
  aJAXPostRequest, dateDiff, dateFormate, deleteData, formValidation, getCurrentDate
} from './helper';
import Toastify from './toastify';

const dateSelectWarn = Toastify({
  text: 'Date not select',
  className: 'info',
})

const baseUrl = process.env.BASE_URL
const userId = document.querySelector('#id').value || false

// Action start
const actionBtn = document.querySelectorAll('.action-btn');
const updateBtn = document.querySelectorAll('.update-btn');
const saveBtn = document.querySelectorAll('.save-btn');
const deleteBtn = document.querySelectorAll('.delete-btn');
const leaveId = document.querySelectorAll('.leave-id');
const startVal = document.querySelectorAll('.start-val');
const endVal = document.querySelectorAll('.end-val');
const duration = document.querySelectorAll('.duration');
const optCancelBtn = document.querySelectorAll('.opt-cancel-btn');
//

for (let i = 0; i < actionBtn.length; i++) {
  actionBtn[i].addEventListener('click', () => {
    actionBtn[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
    deleteBtn[i].style.display = 'block';
  });
}

// when click on update button
for (let i = 0; i < updateBtn.length; i++) {
  updateBtn[i].addEventListener('click', () => {
    updateBtn[i].style.display = 'none';
    saveBtn[i].style.display = 'block';
    deleteBtn[i].style.display = 'none';
    optCancelBtn[i].style.display = 'block';

    startVal[i].focus();
  });
}
// when click on save button
for (let i = 0; i < saveBtn.length; i++) {
  saveBtn[i].addEventListener('click', () => {
    // saveBtn[i].style.display = "none";

    const start = startVal[i].value.trim();
    const end = endVal[i].value.trim();
    const id = leaveId[i].value;
    if (start === '' || end === '') {
      alert('Please fill all the fields');
      return;
    }
    const data = {
      start,
      end,
      id,
    };
    aJAXPostRequest('/options/leavedays/update', data);
    startVal[i].value = data.start;
    endVal[i].value = data.end;
    duration[i].innerText = `${dateDiff(data.start, data.end)} day`;
    saveBtn[i].style.display = 'none';
    actionBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
  });
}

// when click on cancel  button
for (let i = 0; i < optCancelBtn.length; i++) {
  optCancelBtn[i].addEventListener('click', () => {
    saveBtn[i].style.display = 'none';
    actionBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
  });
}

// Action End

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

const dateIcon = document.querySelector('#date-icon');

dateIcon.addEventListener('click', async () => {
  const dateStart = document.querySelector('#startPicker').value
  const startDate = dateFormate(startDatePicker.getFullDate());
  const endDate = dateFormate(
    endDatePicker.getFullDate() || getCurrentDate(),
  );

  if (dateStart === '') {
    return dateSelectWarn.showToast()
  }
  if (userId) {
    window.location = `${baseUrl}/options/leavedays/${userId}?startDate=${startDate || dateStart}&endDate=${endDate}`
  } else {
    window.location = `${baseUrl}/options/leavedays?startDate=${startDate || dateStart}&endDate=${endDate}`;
  }
});

// delete leave day
deleteData(`${baseUrl}/options/leavedays/delete/`)

// form validation
formValidation()

// leave day user Search result

let typingTimer;
const doneTypingInterval = 500;
const input = document.querySelector('input#userSearch');
const users_placeholder = document.querySelector('#user-list');
if (input) {
  input.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    if (input.value === '') {
      users_placeholder.style.display = 'none'
    }
    // reset
    if (input.value) {
      typingTimer = setTimeout(searchUsers, doneTypingInterval);
    }
  });
  // on keydown, clear the countdown
  input.addEventListener('keydown', () => {
    clearTimeout(typingTimer);
  });

  // send request for search
  const searchUsers = async () => {
    const response = await fetch('/user/search', {
      method: 'POST',
      body: JSON.stringify({
        user: input.value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    // get response
    const result = await response.json();
    // handle error and response
    if (result.errors) {
      const errorplaceholder = document.querySelector('p.error');
      errorplaceholder.textContent = result.errors.common.msg;
      errorplaceholder.style.display = 'block';
    } else if (result.length >= 0) {
      let generatedHtml = '<ul>';
      result.forEach((user) => {
        let avatar;
        if (user.avatar !== null && user.avatar.match(/^(http|https):/g)) {
          avatar = `<img
        src="${user.avatar}"
        />`
        } else {
          avatar = `<img
      src="/uploads/avatars/${user.avatar === null ? 'demo-avatar.png' : user.avatar}" />`
        }
        generatedHtml += `<li ><a href="/options/leavedays/${user.id}">
            <div class="user">
              <div class="avatar">
                ${avatar}
              </div>
              <div class="username">${user.user_name.split(' ')[0]}</div>
            </div>
            </a>
          </li>`;
      });
      generatedHtml += '</ul>';
      users_placeholder.innerHTML = generatedHtml;
      users_placeholder.style.display = 'block'
    }
  }
}
