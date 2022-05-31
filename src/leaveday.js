/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import {
  aJAXPostRequest, dateDiff, dateFormate, deleteData, formValidation, getCurrentDate, setReportTitle
} from './helper.js';

const id = document.querySelector('#id').value
console.log(id)
async function pagination(pageNumber, numberOfPage, page) {
  const pagination = document.querySelector('#pagination')
  pagination.innerHTML = `<li class="first page" > </li>
 <li class="prev page"></li>
 ${pageNumber.map((p) => `<a class=${page == p ? 'page-active' : ''} ><li class='page-li' data-page=${p}>  ${p}  </li></a>`).join('')}
 <li class="next page"></li>
 <li class="last page"></li>
 `
  // eslint-disable-next-line no-use-before-define
  loader(numberOfPage, page)
  actions()
}
// console.log('xxx', setReportTitle())

function loader(numberOfPage, pageNO) {
  async function page(pageNo) {
    const startDate = document.querySelector('#startPicker').dataset.date
    const endDate = document.querySelector('#endPicker').dataset.date
    // setReportTitle(startDate, endDate);
    console.log('xxx', setReportTitle(startDate, endDate));

    let data;
    if (id) {
      data = await fetch(
        `${baseUrl}/options/leavedays/${id}/between-two-date?startDate=${startDate}&endDate=${endDate}&page=${pageNo}`,
      );
    } else {
      data = await fetch(
        `${baseUrl}/options/leavedays/between-two-date?startDate=${startDate}&endDate=${endDate}&page=${pageNo}`,
      );
    }

    const holidays = await data.json();

    if (holidays.length === 0) {
      return alert('No Holiday Found');
    }
    console.log('page report', holidays.reports)

    const {
      dateRangeReport, pageNumber, numberOfPage,
    } = holidays.reports
    console.log('ddd', holidays.reports)
    const holidayTable = document.querySelector('#leaveday-table');

    reportHolidayShow(holidayTable, dateRangeReport)
    pagination(pageNumber, numberOfPage, pageNo)
  }
  const pageClassFirst = document.querySelector('.first')
  pageClassFirst.addEventListener('click', () => {
    if (pageNO > 1) {
      page(Number(1))
    }
  })
  const pageClassPrev = document.querySelector('.prev')
  pageClassPrev.addEventListener('click', () => {
    if (pageNO > 1) {
      page(Number(pageNO - 1))
    }
  })
  const pageClassNext = document.querySelector('.next')
  pageClassNext.addEventListener('click', () => {
    if (pageNO < numberOfPage) {
      page(Number(pageNO + 1))
    }
  })
  const pageClassLast = document.querySelector('.last')
  pageClassLast.addEventListener('click', () => {
    if (pageNO < numberOfPage) {
      page(Number(numberOfPage))
    }
  })
  const pageLi = document.getElementsByClassName('page-li')
  for (let i = 0; i < pageLi.length; i++) {
    const pageNum = pageLi[i].dataset.page
    console.log({ pageNum })
    if (pageNum !== '...') {
      pageLi[i].addEventListener('click', () => {
        page(pageNum)
      })
    }
  }
}

document.getElementById('startPicker').addEventListener('blur', () => {
  iconCheck()
})
document.getElementById('endPicker').addEventListener('blur', () => {
  iconCheck()
})
function iconCheck(e) {
  const dateIcon = document.querySelector('#date-icon')
  const data = dateIcon.classList.contains('date-icon-active')
  if (data) {
    return dateIcon.classList.remove('date-icon-active')
  }
}

async function actions() {
  const actionBtn = document.querySelectorAll('.action-btn');
  const updateBtn = document.querySelectorAll('.update-btn');
  const saveBtn = document.querySelectorAll('.save-btn');
  const deleteBtn = document.querySelectorAll('.delete-btn');
  const leaveId = document.querySelectorAll('.leave-id');
  const reasonVal = document.querySelectorAll('.reason-val');
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

      reasonVal[i].focus();
    });
  }
  // when click on save button
  for (let i = 0; i < saveBtn.length; i++) {
    saveBtn[i].addEventListener('click', () => {
    // saveBtn[i].style.display = "none";

      const reason = reasonVal[i].value.trim();
      const start = startVal[i].value.trim();
      const end = endVal[i].value.trim();
      const id = leaveId[i].value;
      console.log(id);
      if (reason === '' || start === '' || end === '') {
        alert('Please fill all the fields');
        return;
      }
      const data = {
        reason,
        start,
        end,
        id,
      };
      console.log(data);
      aJAXPostRequest('/options/leavedays/update', data);
      reasonVal[i].value = data.reason;
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
}
actions();
// pagination
const dateIcon = document.querySelector('#date-icon');
dateIcon.addEventListener('click', async () => {
  const dateStart = document.querySelector('#startPicker');
  const dateEnd = document.querySelector('#endPicker');
  const startDate = dateFormate(startDatePicker.getFullDate());
  const endDate = dateFormate(
    endDatePicker.getFullDate() || getCurrentDate(),
  );
  dateStart.dataset.date = startDate;
  dateEnd.dataset.date = endDate;

  console.log(startDate, endDate);

  if (dateStart.dataset.date === 'null') {
    return alert('date not select');
  }
  let data;
  if (id) {
    data = await fetch(
      `${baseUrl}/options/leavedays/${id}/between-two-date?startDate=${startDate}&endDate=${endDate}`,
    );
  } else {
    data = await fetch(
      `${baseUrl}/options/leavedays/between-two-date?startDate=${startDate}&endDate=${endDate}`,
    );
  }
  console.log(data)
  const leavedays = await data.json();
  console.log(leavedays);

  if (leavedays.length === 0) {
    return alert('No Holiday Found');
  }
  const {
    dateRangeReport, pageNumber, numberOfPage, page,
  } = leavedays.reports
  const holidayTable = document.querySelector('#leaveday-table');

  reportHolidayShow(holidayTable, dateRangeReport)
  if (numberOfPage > 1) {
    pagination(pageNumber, numberOfPage, page)
  }
  dateIcon.classList.add('date-icon-active')
});

function reportHolidayShow(holidayTable, dateRangeReport) {
  holidayTable.innerHTML = dateRangeReport.map(
    (day, idx) => ` <tr>
  
    <td class="table-img">
     
     <img src="/uploads/avatars/${day.avatar != null ? day.avatar : 'demo-avatar.png'}" />
  </td>
  
    <td>
      <div class="username">${day.name}</div>
      <span id="role">${day.user_role === 'admin' ? 'admin' : ''} </span>
    </td>
    <td>
      <input class="reason-val" type="text" value="${day.type}" />
    </td>
    <td>
      <input class="start-val" type="text" value="${day.start} " />
    </td>
    <td><input class="end-val" type="text" value="${day.end}" /></td>
    <td class="duration">${day.duration}   day</td>
    <td >
      <div class="btn-group">
        <button type="button" class="action-btn">Action</button>
        <button type="button" class="update-btn">Update</button>
        <button type="button" class="save-btn">Save</button>
        <input type="hidden" class="leave-id delete-id" value="${day.id}" />
        <a
          class="delete-data"
          ><button class="delete-btn">Delete</button>
        </a>
      </div>
    </td>
  </tr>

     `,

  ).join('');
  deleteData('/leavedays/delete/')
}
// delete leave day
deleteData('/leavedays/delete/')

// form validation
formValidation()

// leave day Search result

let typingTimer;
const doneTypingInterval = 500;
const input = document.querySelector('input#user');
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
