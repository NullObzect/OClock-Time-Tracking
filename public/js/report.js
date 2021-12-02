const baseUrl = 'http://localhost:5000';
const reportData = []
const endData = []
// import  { helperJs } from '/public/js/halper.js';
// console.log("xxx",helperJs)

// Pagination Function start
const pageNumbers = (total, max, current) => {
  const half = Math.floor(max / 2);
  let to = max
  if (current + half >= total) {
    to = total;
  } else if (current > half) {
    to = current + half
  }
  const from = to - max
  return Array.from({ length: max }, (_, i) => (i + 1) + from)
}

// Pagination Button action function

function PaginationButtons(totalPages, maxPageVisible = 10, currentPage = 1) {
  let pages = pageNumbers(totalPages, maxPageVisible, currentPage)
  let currentPageBtn = null;
  const buttons = new Map()
  const fragment = document.createDocumentFragment()
  const paginationButtonContainer = document.createElement('div');
  paginationButtonContainer.className = 'pagination-buttons'

  const disabled = {
    start: () => pages[0] === 1,
    prev: () => currentPage === 1,
    end: () => pages.slice(-1)[0] === totalPages,
    next: () => currentPage === totalPages,
  }

  // Create Button and button details

  const createAndSetupButtons = (label = '', cls = '', disabled = false, handleClick = () => {}) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.className = `page-btn ${cls}`
    button.disabled = disabled
    button.addEventListener('click', (event) => {
      handleClick(event);
      this.update();
      paginationButtonContainer.value = currentPage;
      paginationButtonContainer.dispatchEvent(new Event('change'));
    })
    return button
  }

  const onPageButtonClick = (e) => currentPage = Number(e.currentTarget.textContent)

  const onPageButtonUpdate = (index) => (btn) => {
    btn.textContent = pages[index]
    if (pages[index] === currentPage) {
      currentPageBtn.classList.remove('active')
      btn.classList.add('active')
      currentPageBtn = btn;
      currentPageBtn.focus()
    }
  }

  buttons.set(createAndSetupButtons('start', 'start-page', disabled.start(), () => currentPage = 1), (btn) => btn.disabled = disabled.start())
  buttons.set(createAndSetupButtons('prev', 'prev-page', disabled.prev(), () => currentPage -= 1), (btn) => btn.disabled = disabled.prev())

  pages.forEach((pageNumber, index) => {
    const isCurrentPage = pageNumber === currentPage
    const button = createAndSetupButtons(pageNumber, isCurrentPage ? 'active' : '', false, onPageButtonClick)
    if (isCurrentPage) {
      currentPageBtn = button;
    }
    buttons.set(button, onPageButtonUpdate(index))
  })

  buttons.set(createAndSetupButtons('next', 'next-page', disabled.next(), () => currentPage += 1), (btn) => btn.disabled = disabled.next())

  buttons.set(createAndSetupButtons('end', 'end-page', disabled.end(), () => currentPage = totalPages), (btn) => btn.disabled = disabled.end())
  buttons.forEach((_, btn) => {
    fragment.appendChild(btn)
  })

  this.render = (container = document.body) => {
    paginationButtonContainer.appendChild(fragment)
    console.log('render', container.children.length)
    if (container.children.length === 1) {
      container.removeChild(container.children[0])
    }
    container.appendChild(paginationButtonContainer)
  }

  this.update = (newPageNumber = currentPage) => {
    currentPage = newPageNumber
    pages = pageNumbers(totalPages, maxPageVisible, currentPage)
    buttons.forEach((updateButton, button) => updateButton(button))
  }
  this.onChange = (handler) => {
    paginationButtonContainer.addEventListener('change', handler);
  }
}
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
  <td class="p-3"> ${el.fixed_total}hr</td>
  <td class="p-3"> ${el.weekTotal || '00'} </td>
  <td class="p-3"> </td>
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
    `${baseUrl}/report/between/two-date?startDate=${startDate}&endDate=${endDate}`,
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
  <td class="p-3"> ${el.fixed_total}hr</td>
  <td class="p-3"> ${el.weekTotal || '00'} </td>
  <td class="p-3"> </td>
  </tr>
    `)
  endData.push(getReports)
  show(getReports)
};

function show(data) {
  const anUserReportTable = document.getElementById('an-user-report');
  const paginationShow = document.getElementById('pagination-show')
  const viewPerPage = 4
  const paginationBtn = 5
  const report = data
  const pageCount = Math.ceil(report.length / viewPerPage)

  // Pagination Button
  let pageVisible = 0
  if (startDate.length < paginationBtn) {
    pageVisible = 1
  } else {
    const PN = Math.floor(report.length / paginationBtn)

    pageVisible = PN
    if (PN > paginationBtn) {
      pageVisible = paginationBtn
    }
  }

  const paginationButtons = new PaginationButtons(pageCount, pageVisible)
  console.log('dd', report.length)

  if (report.length > viewPerPage) {
    paginationButtons.render(paginationShow)
  }
  paginationButtons.onChange((e) => {
    dataShow(report, anUserReportTable, viewPerPage, e.target.value)
  });

  dataShow(report, anUserReportTable, viewPerPage, 1)

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
