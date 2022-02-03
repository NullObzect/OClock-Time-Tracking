const PaginationButtons = require('../utilities/pagination')

console.log(PaginationButtons)

const baseUrl = 'http://localhost:5000';
const reportData = []
const endData = []
// import  { helperJs } from '/public/js/halper.js';
// console.log("xxx",helperJs)

function calculateTime(fixedTime, workingTotalSec) {
  const getFixedSec = Number(fixedTime * 60 * 60);
  let getTotalSec = getFixedSec - workingTotalSec
  const hours = Math.floor(getTotalSec / 3600);
  getTotalSec %= 3600;
  const minutes = Math.floor(getTotalSec / 60);
  const seconds = getTotalSec % 60;

  return `${hours}:${minutes}:${seconds}`
}
// Pagination Function start

// Pagination Function end

// get start date
let startDate;

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
  const getDate = getDateFormat(event.target.value);
  console.log(getDate)

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
    `${baseUrl}/reports/between/two-date?startDate=${startDate}&endDate=${getCurrentDate()}`,
  );
  const getObjects = await data.json();
  const getReports = getObjects.reports.dataToJson

  // between to data total
  const dateRangeTotalTr = document.getElementById('last-seven-days-total')

  const getReportsTotal = getObjects.reportDateRangeTotal.betweenTowDateTotalToJson
  console.log({ getReportsTotal });
  dateRangeTotalTr.innerHTML = getReportsTotal.map((el) => `
    
    <tr class="bg-blue-500 text-center text-white font-bold">
    <td colspan="2">Total =  ${el.present} </td>
  <td class="p-3">${el.avgStartTime || '00'} </td>
  <td class="p-3">${el.avgEndTime || '00'} </td>
  <td class="p-3"></td>
  <td class="p-3"> ${el.fixed_total || '00'}hr</td>
  <td class="p-3"> ${el.weekTotal || '00'} </td>
  <td class="p-3">${el.totalLessORExtra || '00'}</td>
  </tr>
    `)

  reportData.push(getReports)
  // console.log('start', jsonData)
  show(getReports)
}

// end date

const selectEndDate = async (event) => {
  const endDate = event.target.value;

  console.log('end date', endDate);
  const data = await fetch(
    `${baseUrl}/reports/between/two-date?startDate=${startDate}&endDate=${endDate}`,
  );
  const getObjects = await data.json();
  const getReports = getObjects.reports.dataToJson

  const dateRangeTotalTr = document.getElementById('last-seven-days-total')

  const getReportsTotal = getObjects.reportDateRangeTotal.betweenTowDateTotalToJson
  console.log({ getReportsTotal });

  dateRangeTotalTr.innerHTML = getReportsTotal.map((el) => `
    
    <tr class="bg-blue-500 text-center text-white font-bold">
    <td colspan="2">Total =  ${el.present} </td>
  <td class="p-3">${el.avgStartTime || '00'} </td>
  <td class="p-3">${el.avgEndTime || '00'} </td>
  <td class="p-3"></td>
  <td class="p-3"> ${el.fixed_total || '00'}hr</td>
  <td class="p-3"> ${el.weekTotal || '00'} </td>
  <td class="p-3">${el.totalLessORExtra || '00'}</td>
  </tr>
    `)

  endData.push(getReports)
  show(getReports)
};

function show(data) {
  const anUserReportTable = document.getElementById('an-user-reports');
  const paginationShow = document.getElementById('pagination-show')
  const viewPerPage = 4
  const paginationBtn = 5
  const reports = data
  const pageCount = Math.ceil(reports.length / viewPerPage)

  // Pagination Button
  let pageVisible = 0
  if (startDate.length < paginationBtn) {
    pageVisible = 1
  } else {
    const PN = Math.floor(reports.length / paginationBtn)

    pageVisible = PN
    if (PN > paginationBtn) {
      pageVisible = paginationBtn
    }
  }

  const paginationButtons = new PaginationButtons(pageCount, pageVisible)
  console.log('dd', reports.length)

  if (reports.length > viewPerPage) {
    paginationButtons.render(paginationShow)
  }
  paginationButtons.onChange((e) => {
    dataShow(reports, anUserReportTable, viewPerPage, e.target.value)
  });

  dataShow(reports, anUserReportTable, viewPerPage, 1)

  function dataShow(items, wapper, rowsPerPage, page) {
    wapper.innerHTML = ''
    page--;
    const start = rowsPerPage * page
    const end = start + rowsPerPage
    const paginateItems = items.slice(start, end)
    for (let i = 0; i < paginateItems.length; i++) {
      const el = paginateItems[i]
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
      workHour.textContent = el.day === 'Friday' ? '0' : el.fixed_time
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
}
