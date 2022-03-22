/* eslint-disable no-return-assign */
import {
  aJAXPostRequest, dateDiff, dateFormate, getCurrentDate, test
} from './helper.js';

// const helper = require('./halper.js');

// console.log({ helper })

console.log('hello');
console.log('teest', test())

actions()
async function actions() {
  const actionBtn = document.querySelectorAll('.action-btn');
  const updateBtn = document.querySelectorAll('.update-btn');
  const deleteBtn = document.querySelectorAll('.delete-btn');
  const saveBtn = document.querySelectorAll('.save-btn');
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
    });
  }
}

// const holidayTable = document.querySelector('#holiday-table');

// action buttons
const dateIcon = document.querySelector('#date-icon');

dateIcon.addEventListener('click', async () => {
  const dateStart = document.querySelector('#startPicker')
  const dateEnd = document.querySelector('#endPicker')
  const startDate = dateFormate(startDatePicker.getFullDate())
  const endDate = dateFormate(endDatePicker.getFullDate() || getCurrentDate())
  dateStart.dataset.date = startDate
  dateEnd.dataset.date = endDate

  console.log(startDate, endDate)

  if (dateStart.dataset.date === 'null') {
    return alert('date not select');
  }

  const data = await fetch(
    `${baseUrl}/options/holiday/between-two-date?startDate=${startDate}&endDate=${endDate}`,
  );

  const holidays = await data.json();
  console.log(holidays);

  if (holidays.length === 0) {
    return alert('No Holiday Found');
  }

  const {
    dateRangeReport, pageNumber, pageLength, page, numberOfPage,
  } = holidays.reports
  const holidayTable = document.querySelector('#holiday-table');

  reportHolidayShow(holidayTable, dateRangeReport)
  pagination(pageNumber, numberOfPage)

  await actions();
  // iconCheck(e);
  // console.log('icon', iconCheck(e))
})

function reportHolidayShow(holidayTable, dateRangeReport) {
  holidayTable.innerHTML = dateRangeReport.map(
    (day, idx) => `
  
      <tr>
        <td class="">${idx + 1}</td>
        <td>
          <input class="title-value" type="text" value="${day.title}" />
        </td>
        <td>
          <input
            class="start-date-value"
            type="text"
            value="${day.start}"
          />
        </td>
        <td>
          <input class="end-date-value" type="text" value="${day.end}" />
        </td>
        <td class="duration">${day.duration}   day</td>
         ${loggedInUser === 'admin'
    ? `<td class="btn-group">
          <button   class="action-btn">Action</button>
          <button  class="update-btn">Update</button>
          <button  class="save-btn">Save</button>
  
          <a
            onclick=" return confirm('Are you Sure???')"
            href="/delete/holiday/${day.id}"
          >
            <button type="text" class="delete-btn">Delete</button>
          </a>
          <input type="hidden" class="holiday-id" value="${day.id}" />
  
        </td>` : ''}  </tr>
      `,

  ).join('');
}

function pagination(pageNumber, numberOfPage, page) {
  const pagination = document.querySelector('#pagination')
  return pagination.innerHTML = `<li class="first"  onclick="page(${1})"> </li> 
 <li class="prev" ${Number(page === 1) ? "onclick='this.disabled=true'" : `onclick=page(${Number(page - 1)})`}></li> 
 ${pageNumber.map((p) => `<a class=${page == p ? 'page-active' : ''} ><li onclick="page(${p})">  ${p}  </li></a>`).join('')}
 <li class="next" ${Number(page === numberOfPage) ? "onclick='this.disabled=true'" : `onclick=page(${Number(page + 1)})`}></li> 
 <li class="last" onclick="page(${numberOfPage})"></li> 
 `
}
console.log('end of script file');
/*
async function page(pageNo) {
  const data = await fetch(
    `${baseUrl}/options/holiday/between-two-date?startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}`,
  );

  const holidays = await data.json();
  console.log(holidays);

  if (holidays.length === 0) {
    return alert('No Holiday Found');
  }

  const {
    dateRangeReport, pageNumber, numberOfPage,
  } = holidays.reports
  const holidayTable = document.querySelector('#holiday-table');

  reportHolidayShow(holidayTable, dateRangeReport)
  pagination(pageNumber, numberOfPage, pageNo)

  await actions();
} */
