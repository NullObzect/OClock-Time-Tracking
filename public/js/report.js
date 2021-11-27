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
  const paginationShow = document.getElementById('pagination-show')
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
  const viewPerPage = 4
  const pageCount = Math.ceil(jsonData.length / viewPerPage)

  // Pagination Button
  let pageVisible = 0
  if (jsonData.length < 5) {
    pageVisible = 1
  } else {
    const PN = Math.floor(jsonData.length / 5)

    pageVisible = PN
    if (PN > 5) {
      pageVisible = 5
    }
  }

  const paginationButtons = new PaginationButtons(pageCount, pageVisible)
  paginationButtons.render(paginationShow)

  paginationButtons.onChange((e) => {
    dataShow(jsonData, anUserReportTable, viewPerPage, e.target.value)
  });
  dataShow(jsonData, anUserReportTable, viewPerPage, 1)
  function dataShow(items, wapper, rowsPerPage, page) {
    console.log(items)
    wapper.innerHTML = ''
    page--;
    const start = rowsPerPage * page
    const end = start + rowsPerPage
    const paginateItems = items.slice(start, end)

    // jsonData.map((el) => console.log(el.create_date));
    // console.log(jsonData);
    for (let i = 0; i < paginateItems.length; i++) {
      const el = paginateItems[i]
      //   const content = `
      //         <tr class="${el.day === 'Friday' ? 'bg-red-200'
      // : el.type === 'holiday' ? 'bg-yellow-200' : el.type === 'leave' ? 'bg-red-400' : 'bg-blue-200'} lg:text-black">
      //         <td class="p-3">${el.day}</td>
      //         <td class="p-3 font-medium capitalize">${el.date}</td>
      //           <td class="p-3">${el.start}</td>
      //           <td class="p-3">${el.end}</td>
      //           <td class="p-3 font-medium">${el.day === 'Friday' ? 'Off day' : el.type}</td>
      //           <td class="p-3">${el.day === 'Friday' ? '0' : '6'}</td>
      //           <td class="p-3">${el.working_time}</td>
      //           <td class="p-3">${el.day === 'Friday' ? el.working_time : el.time_count}</td>
      //         </tr>
      //         `

      const content = document.createElement('tr')
      content.className = `${el.day === 'Friday' ? 'bg-red-200'
        : el.type === 'holiday' ? 'bg-yellow-200' : el.type === 'leave' ? 'bg-red-400' : 'bg-blue-200'} lg:text-black`
      const workDay = document.createElement('td')
      workDay.className = 'p-3'
      workDay.textContent = el.day
      const workDate = document.createElement('td')
      workDate.className = 'p-3 font-medium capitalize'
      workDate.textContent = el.date
      const workStart = document.createElement('td')
      workStart.className = 'p-3'
      workStart.textContent = el.start
      const workEnd = document.createElement('td')
      workEnd.className = 'p-3'
      workEnd.textContent = el.end
      const workStatus = document.createElement('td')
      workStatus.className = 'p-3 font-medium'
      workStatus.textContent = el.day === 'Friday' ? 'Off day' : el.type
      const workHour = document.createElement('td')
      workHour.className = 'p-3'
      workHour.textContent = el.day === 'Friday' ? '0' : '6'
      const workTime = document.createElement('td')
      workTime.className = 'p-3'
      workTime.textContent = el.working_time
      const workResult = document.createElement('td')
      workResult.className = 'p-3'
      workResult.textContent = el.day === 'Friday' ? el.working_time : el.time_count

      content.appendChild(workDay)
      content.appendChild(workDate)
      content.appendChild(workStart)
      content.appendChild(workEnd)
      content.appendChild(workStatus)
      content.appendChild(workHour)
      content.appendChild(workTime)
      content.appendChild(workResult)
      wapper.append(content)
    }
  }

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
}
