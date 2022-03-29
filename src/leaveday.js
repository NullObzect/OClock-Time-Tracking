import {
  aJAXPostRequest, dateDiff, dateFormate, getCurrentDate,
} from './helper.js';

function pagination(pageNumber, numberOfPage, page) {
  const pagination = document.querySelector('#pagination')
  pagination.innerHTML = `<li class="first page" > </li>
 <li class="prev page"></li>
 ${pageNumber.map((p) => `<a class=${page == p ? 'page-active' : ''} ><li class='page-li'>  ${p}  </li></a>`).join('')}
 <li class="next page"></li>
 <li class="last page"></li>
 `
  // eslint-disable-next-line no-use-before-define
  loader(numberOfPage, page)
}

function loader(numberOfPage, pageNO) {
  async function page(pageNo) {
    const startDate = document.querySelector('#startPicker').dataset.date
    const endDate = document.querySelector('#endPicker').dataset.date
    const data = await fetch(
      `${baseUrl}/options/leavedays/between-two-date?startDate=${startDate}&endDate=${endDate}&page=${pageNo}`,
    );
    const holidays = await data.json();
    if (holidays.length === 0) {
      return alert('No Holiday Found');
    }
    console.log('page report', holidays.reports)

    const {
      dateRangeReport, pageNumber, numberOfPage,
    } = holidays.reports
    const holidayTable = document.querySelector('#leaveday-table');

    reportHolidayShow(holidayTable, dateRangeReport)
    pagination(pageNumber, numberOfPage, pageNo)

    await actions();
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
    pageLi[i].addEventListener('click', () => {
      page(i + 1)
    })
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

function actions() {
  const actionBtn = document.querySelectorAll('.action-btn');
  const updateBtn = document.querySelectorAll('.update-btn');
  const saveBtn = document.querySelectorAll('.save-btn');
  const deleteBtn = document.querySelectorAll('.delete-btn');
  const leaveId = document.querySelectorAll('.leave-id');
  const reasonVal = document.querySelectorAll('.reason-val');
  const startVal = document.querySelectorAll('.start-val');
  const endVal = document.querySelectorAll('.end-val');
  const duration = document.querySelectorAll('.duration');
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

  const data = await fetch(
    `${baseUrl}/options/leavedays/between-two-date?startDate=${startDate}&endDate=${endDate}`,
  );

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
  console.log(dateRangeReport)
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