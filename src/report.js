// Date change to date icon active remove

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
      `${baseUrl}/reports/between/two-date?startDate=${startDate}&endDate=${endDate}&page=${pageNo}`,
    );
    const getObjects = await data.json();
    // let isZero;
    const {
      dateRangeReport, pageNumber, pageLength, page, numberOfPage,
    } = getObjects.reports

    const reportTableBody = document.querySelector('#an-user-report')
    reportShow(reportTableBody, dateRangeReport)
    if (numberOfPage > 1) {
      pagination(pageNumber, numberOfPage, pageNo)
    }
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

// getDate format
function getDateFormat(date) {
  if (date === null) {
    return null
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
const dateIcon = document.querySelector('#date-icon');
dateIcon.addEventListener('click', () => {
  dateRange()
})
async function dateRange(event) {
  const dateIcon = document.querySelector('#date-icon')
  const dateStart = document.querySelector('#startPicker')
  const dateEnd = document.querySelector('#endPicker')
  const startDate = getDateFormat(startDatePicker.getFullDate())
  const endDate = getDateFormat(endDatePicker.getFullDate() || getCurrentDate())
  console.log(startDate, endDate)

  dateStart.dataset.date = startDate
  dateEnd.dataset.date = endDate

  if (dateStart.dataset.date === 'null') {
    return alert('date not select')
  }

  const data = await fetch(
    `${baseUrl}/reports/between/two-date?startDate=${startDate}&endDate=${endDate}`,
  );
  const getObjects = await data.json();
  // let isZero;
  const {
    dateRangeReport, pageNumber, page, numberOfPage,
  } = getObjects.reports
  const reportTableBody = document.querySelector('#an-user-report')
  reportShow(reportTableBody, dateRangeReport)
  if (numberOfPage > 1) {
    pagination(pageNumber, numberOfPage, page)
  }
  dateIcon.classList.add('date-icon-active')

  const dateRangeTotalBox = getObjects.dateRangeReportBox;
  const { betweenTwoDatesReportDetails } = dateRangeTotalBox;
  const totalReport = document.getElementById('total-report');
  const filteredReport = document.querySelector('.filtered-report');
  const selectStartDate = document.querySelector('.select-start-date');
  const selectEndDate = document.querySelector('.select-end-date');
  const reportTitle = document.querySelector('.report-title');

  if (dateRangeTotalBox === null) {
    filteredReport.style.display = 'none !important';
  } else {
    filteredReport.style.display = 'block';
    filteredReport.style.display = 'flex';
    selectStartDate.textContent = startDate
    selectEndDate.textContent = endDate || getCurrentDate()
    reportTitle.innerHTML = `Report between <b>${startDate}</b> and <b>${endDate}</b>`
    totalReport.innerHTML = `
          <tr>
            <td>Workday:</td>
            <td> ${betweenTwoDatesReportDetails.totalWorkingDays}/${betweenTwoDatesReportDetails.fixedWorkdays} day <span class="${betweenTwoDatesReportDetails.classLowOrHighForDay}">${betweenTwoDatesReportDetails.daysIsLowOrHigh}</span></td>
          </tr>
          <tr>
            <td>Work hour:</td>
            <td>${`${betweenTwoDatesReportDetails.workingTotalHr}/${betweenTwoDatesReportDetails.fixedTotalHr}`} hr<span class="${betweenTwoDatesReportDetails.classLowOrHighForHr}">${
  betweenTwoDatesReportDetails.isTotalExtraOrLessHr}</span> </td>
          </tr>
          <tr>
            <td>Avg Work:</td>
              <td>${betweenTwoDatesReportDetails.avgWorkHr} hr <span class="${betweenTwoDatesReportDetails.classLowOrHighForHr}">${
  betweenTwoDatesReportDetails.isAvgExtraOrLessHr}</span></td>
          </tr>
          <tr>
            <td>Avg Start:</td>
            <td>${betweenTwoDatesReportDetails.avgStartTime} </td>
          </tr>
          <tr>
            <td>Avg End:</td>
            <td>${betweenTwoDatesReportDetails.avgEndTime}</td>
          </tr>
       
  `
  }
}

// async function page(pageNo) {
//   const startDate = document.querySelector('#startPicker').dataset.date
//   const endDate = document.querySelector('#endPicker').dataset.date
//   const data = await fetch(
//     `${baseUrl}/reports/between/two-date?startDate=${startDate}&endDate=${endDate}&page=${pageNo}`,
//   );
//   const getObjects = await data.json();
//   // let isZero;
//   const {
//     dateRangeReport, pageNumber, pageLength, page, numberOfPage,
//   } = getObjects.reports

//   const reportTableBody = document.querySelector('#an-user-report')
//   reportShow(reportTableBody, dateRangeReport)
//   pagination(pageNumber, numberOfPage, pageNo)
// }

function reportShow(reportTableBody, dateRangeReport) {
  return reportTableBody.innerHTML = dateRangeReport.map((el) => ` 
         
   <tr
        class="
          ${
  el.dayType
          === 'offday'
    ? 'bg-red-200' : el.dayType === 'holiday'

      ? 'bg-yellow-200' : el.dayType === 'leave' ? 'bg-red-400' : 'bg-blue-200'

}
          text-black
        "
      >
        <td>${el.date} <br> ${el.day}</td>
        <td> ${el.dayType} </td>
       
        <td>${el.start} <span class="${el.inTimeExtraOrLess.length === 6 ? 'low' : el.inTimeExtraOrLess === '' ? ' ' : 'high'}" >${el.inTimeExtraOrLess.length === 5 ? `+${el.inTimeExtraOrLess}` : el.inTimeExtraOrLess}</span> </td>

        <td>${el.end}<span class="${el.outTimeExtraOrLess.length === 5 ? 'low' : el.outTimeExtraOrLess === '' ? ' ' : 'high'}">${el.outTimeExtraOrLess.length === 5 ? `-${el.outTimeExtraOrLess}` : `${el.outTimeExtraOrLess}` === '' ? ' ' : `+${el.outTimeExtraOrLess.slice(1)}`}</span> </td>
        
        <td>${`${el.workTime} / ${el.workHr} hr`}<span class="${el.totalTimeExtraOrLess.length == '0' ? '' : el.totalTimeExtraOrLess[0] !== '-' ? 'high' : 'low'}" >${el.totalTimeExtraOrLess.length - 1 === 4 ? `+${el.totalTimeExtraOrLess}` : el.totalTimeExtraOrLess}</span></td>
      
        
      </tr> 
   

   `).join('')
}
