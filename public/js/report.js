const baseUrl = 'http://localhost:5000';

// import  { helperJs } from '/public/js/halper.js';
// console.log("xxx",helperJs)

const anUserReportTable = document.getElementById('an-user-report');

// get start date
let startDate;
console.log('kkk');

// getDate format
function getDateFormat(date) {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  today = `${yyyy}-${mm}-${dd}`;

  return today;
}

const selectStartDate = async (event) => {
  console.log(event.target.value);
  const getDate = getDateFormat(event.target.value);

  console.log('start date', getDate);

  startDate = getDate;

  // get current date
  function getCurrentDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = `${yyyy}-${mm}-${dd}`;

    return today;
  }

  const data = await fetch(
    `${baseUrl}/report/between/two-date?startDate=${startDate}&endDate=${getCurrentDate()}`,
  );
  const jsonData = await data.json();
  jsonData.map((el) => console.log(el.create_date));
  console.log(jsonData);
  anUserReportTable.innerHTML = jsonData
    .map(
      (el) => `
          <tr class="${el.day === 'Friday' ? 'bg-red-200'
    : el.type === 'holiday' ? 'bg-yellow-200' : el.type === 'leave' ? 'bg-red-400' : 'bg-blue-200'} lg:text-black">
          <td class="p-3">${el.day}</td>
          <td class="p-3 font-medium capitalize">${el.date}</td>
            <td class="p-3">${el.start}</td>
            <td class="p-3">${el.end}</td>
            <td class="p-3 font-medium">${el.day === 'Friday' ? 'Off day' : el.type}</td>
            <td class="p-3">${el.day === 'Friday' ? '0' : el.fixed_time}</td>
            <td class="p-3">${el.working_time}</td>
            <td class="p-3">${el.day === 'Friday' ? el.working_time : el.time_count}</td>
          </tr>
          `,
    )
    .join('');
};

// end date

const selectEndDate = async (event) => {
  const endDate = event.target.value;

  console.log('end date', endDate);
  const data = await fetch(
    `${baseUrl}/report/between/two-date?startDate=${startDate}&endDate=${endDate}`,
  );
  const jsonData = await data.json();
  jsonData.map((el) => console.log(el.create_date));
  console.log(jsonData);
  anUserReportTable.innerHTML = jsonData
    .map(
      (el) => `
          <tr class="${el.day === 'Friday' ? 'bg-red-200'
    : el.type === 'holiday' ? 'bg-yellow-200' : el.type === 'leave' ? 'bg-red-400' : 'bg-blue-200'} lg:text-black">
          <td class="p-3">${el.day}</td>
          <td class="p-3 font-medium capitalize">${el.date}</td>
            <td class="p-3">${el.start}</td>
            <td class="p-3">${el.end}</td>
            <td class="p-3 font-medium">${el.day === 'Friday' ? 'Off day' : el.type}</td>
            <td class="p-3">${el.day === 'Friday' ? '0' : '6'}</td>
            <td class="p-3">${el.working_time}</td>
            <td class="p-3">${el.day === 'Friday' ? el.working_time : el.time_count}</td>
          </tr>
          `,
    )
    .join('');
};


