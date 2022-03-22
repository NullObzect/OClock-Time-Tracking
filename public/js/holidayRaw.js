import {
  aJAXPostRequest, dateDiff
} from './halperRaw.js';

console.log('hello');

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
console.log('end');

const holidayTable = document.querySelector('#holiday-table');
// Date change to date icon active remove

function iconCheck(e) {
  const dateIcon = document.querySelector('#date-icon');
  const data = dateIcon.classList.contains('date-icon-active');
  if (data) {
    return dateIcon.classList.remove('date-icon-active');
  }
}
// getDate format
function getDateFormat(date) {
  if (date === null) {
    return null;
  }
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  today = `${yyyy}-${mm}-${dd}`;
  return today;
}
// get current date
function getCurrentDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  today = `${yyyy}-${mm}-${dd}`;

  return today;
}

function dateRange(event) {
  console.log('date range');
  const dateIcon = document.querySelector('#date-icon');
  const dateStart = document.querySelector('#startPicker');
  const dateEnd = document.querySelector('#endPicker');
  const startDate = getDateFormat(startDatePicker.getFullDate());
  const endDate = getDateFormat(
    endDatePicker.getFullDate() || getCurrentDate(),
  );

  dateStart.dataset.date = startDate;
  dateEnd.dataset.date = endDate;

  if (dateStart.dataset.date === 'null') {
    return alert('date not select');
  }

  console.log(startDate, endDate);

  /* const data = await fetch(
    `${baseUrl}/options/holiday/between-two-date?startDate=${startDate}&endDate=${endDate}`,
  );

  const holidays = await data.json();
  console.log(holidays);

  if (holidays.length === 0) {
    return alert('No Holiday Found');
  }
  holidayTable.innerHTML = holidays.map(
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
      <td class="duration">${day.duration}   'day'}</td>

      <td class="btn-group">
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

      </td>
    </tr>
    `,
  );
 */
  // add action code here
}
console.log('asdfasdfjlk', dateRange());

console.log('end of script file');
