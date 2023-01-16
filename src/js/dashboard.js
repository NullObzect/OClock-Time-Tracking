import {
  aJAXPostRequest
} from './helper.js';
import Toastify from './toastify.js';

const timeNullToast = Toastify({
  text: 'Time not select',
  className: 'warning',
})
const successToast = Toastify({
  text: 'Time update successfully',
})
const baseUrl = process.env.BASE_URL

// for update start and end time

const updateStartTime = document.querySelectorAll('.update-start-time');
const updateEndTime = document.querySelectorAll('.update-end-time');
const updateBtn = document.querySelectorAll('.update-btn');
const saveBtn = document.querySelectorAll('.save-btn');
const updateStartTimeVal = document.querySelectorAll('.update-start-time-val');
const updateEndTimeVal = document.querySelectorAll('.update-end-time-val');
const userId = document.querySelectorAll('.userId');
const getDate = document.querySelectorAll('.get-date');
const saveBtnForEndTime = document.querySelectorAll('.save-btn-for-end-time');
const optCancelBtn = document.querySelectorAll('.opt-cancel-btn');

//
for (let i = 0; i < updateStartTime.length; i++) {
  updateBtn[i].addEventListener('click', () => {
    updateBtn[i].style.display = 'none';
    updateStartTime[i].style.display = 'block';
    updateEndTime[i].style.display = 'block';
  });
}
for (let i = 0; i < updateStartTime.length; i++) {
  updateStartTime[i].addEventListener('click', () => {
    updateStartTime[i].style.display = 'none';
    updateEndTime[i].style.display = 'none';
    saveBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'block';
    // updateStartTimeVal[i].type = 'time';
    updateStartTimeVal[i].focus();
  });
  saveBtn[i].addEventListener('click', () => {
    if (updateStartTimeVal[i].value === '') {
      timeNullToast.showToast();
      updateStartTimeVal[i].focus();
    }
    const data = {
      userId: userId[i].value,
      startTime: updateStartTimeVal[i].value,
      date: getDate[i].value,
    }
    aJAXPostRequest('/update-start-time', data)
    saveBtn[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
  });
}

// update end time
for (let i = 0; i < updateEndTime.length; i++) {
  updateEndTime[i].addEventListener('click', () => {
    updateEndTime[i].style.display = 'none';
    saveBtnForEndTime[i].style.display = 'block';
    updateStartTime[i].style.display = 'none';
    optCancelBtn[i].style.display = 'block';
    // updateEndTimeVal[i].type = 'time';
    updateEndTimeVal[i].focus();
    const data = {
      userId: userId[i].value,
      endTime: updateEndTimeVal[i].value,
      date: getDate[i].value,
    }
  });
  saveBtnForEndTime[i].addEventListener('click', () => {
    if (updateEndTimeVal[i].value === '') {
      alert('Please enter end time');
      updateEndTimeVal[i].focus();
    }
    const data = {
      userId: userId[i].value,
      endTime: updateEndTimeVal[i].value,
      date: getDate[i].value,
    }
    aJAXPostRequest('/update-end-time', data)
    saveBtnForEndTime[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    return window.location.reload();
  });
}
// when click on cancel button
for (let i = 0; i < optCancelBtn.length; i++) {
  optCancelBtn[i].addEventListener('click', () => {
    updateBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    saveBtn[i].style.display = 'none';
    saveBtnForEndTime[i].style.display = 'none';
  });
}

// add internal script in dashboard

const userNameBtn = document.querySelectorAll('.userBtn')
const userDetailsModal = document.querySelector('#userDetails')
const userDetailsModalClose = document.querySelector('.user-modal-close')
const container = userDetailsModal.querySelector('.user-user-container')
for (let i = 0; i < userNameBtn.length; i++) {
  userNameBtn[i].addEventListener('click', async (e) => {
    const element = e.target
    const userId = element.dataset.userid
    const api = await fetch(`/dashboard/user-today-details-for-admin/${userId}`)
    const data = await api.json()
    const {
      userInfo, todayReportDetails, weekReportDetails, todayWorkList, lateCountThisWeek,
    } = data

    const bodyData = `  <div class="user-details-head">
          <div class="user-details">
            <div class="img">
             ${userInfo.avatar !== null && userInfo.avatar.match(/^(http|https):/g)
    ? `<img src=\"${userInfo.avatar}\"/>`
    : `<img src=\"/uploads/avatars/${userInfo.avatar !== null ? userInfo.avatar : userInfo.gender == 'male' ? 'demo-avatar.png' : 'female-demo-avatar.png'}\" />`}
            </div>
            <div class="user-info">
            <div class="user-name">${userInfo.user_name}</div>
            <div class="user-mail">${userInfo.user_mail}</div>
            </div>
          </div>
          <div class="report-btn"><a href="/reports/${userId}">Report</a></div>
        </div>
        <div class="user-today-info">
          <table>
            <tr>
              <td>Entry :</td>
              <td>${todayReportDetails.start} <span class="${todayReportDetails.inTimeExtraOrLess.length === 6 ? 'low' : todayReportDetails.inTimeExtraOrLess === '' ? ' ' : 'high'}" >${todayReportDetails.inTimeExtraOrLess.length === 5 ? `+${todayReportDetails.inTimeExtraOrLess}` : todayReportDetails.inTimeExtraOrLess}</span></td>
            </tr>
            <tr>
              <td>Exit :</td>
              <td>${todayReportDetails.end} <span class="${todayReportDetails.outTimeExtraOrLess.length === 5 ? 'low' : todayReportDetails.outTimeExtraOrLess === '' ? ' ' : 'high'}" >${todayReportDetails.outTimeExtraOrLess.length === 5 ? `-${todayReportDetails.outTimeExtraOrLess}` : todayReportDetails.outTimeExtraOrLess === '' ? ' ' : `+${todayReportDetails.outTimeExtraOrLess.slice(1)}`}</span></td>
            </tr>
            <tr>
              <td>Today Total Work : </td>
              <td>${todayReportDetails.todayTotal} hr <span class="${todayReportDetails.isLowOrHighClassForToday}">${todayReportDetails.isTotalExtraOrLessHr}</span></td>
            </tr>
            <tr>
              <td>Weekly Workday :</td>
              <td>${weekReportDetails.totalWorkingDays}/${weekReportDetails.fixedWorkdays} days <span class="${weekReportDetails.classLowOrHighForDay}">${weekReportDetails.daysIsLowOrHigh}</span></td>
            </tr>
            <tr>
              <td>Weekly Work :</td>
              <td>${weekReportDetails.workingTotalHr}/${weekReportDetails.fixedTotalHr} hr  <span class="${weekReportDetails.classLowOrHighForHr || ''}">${weekReportDetails.isTotalExtraOrLessHr}</span></td>
            </tr>
            <tr>
              <td>Late Count in Week :</td>
              <td>${lateCountThisWeek} days</td>
            </tr>

          </table>
        </div>
        <div class="user-work-details">
          <div class="working-user">
            <div class="card-header">
              <h2>Today Details</h2>
            </div>

            <table>
              <thead>
                <tr>
                  <td>Project</td>
                  <td>Details</td>
                  <td>Start</td>
                  <td>End</td>
                  <td>total</td>
                </tr>
              </thead>
              <tbody>
                ${todayWorkList.map((tw) => `<tr>
                  <td>${tw.project_name}</td>
                  <td>${tw.work_details}</td>
                  <td>${tw.start}</td>
                  <td>${tw.end}</td>
                  <td>${tw.total}</td>
                </tr>`)}
              </tbody>
            </table>
          </div>
        </div>`
    container.innerHTML = bodyData
    userDetailsModal.style.display = 'block'
  })
}
userDetailsModalClose.addEventListener('click', () => {
  userDetailsModal.style.display = 'none'
})

// for dat file upload

const getDatFileForm = document.querySelector('.dat-file')
const datFileInput = document.querySelector('.dat-file-input')
const fileStatus = document.querySelector('.file-status')

getDatFileForm.addEventListener('change', (e) => {
  e.preventDefault()
  fileStatus.textContent = 'uploading...'
  const datFile = datFileInput.files[0]
  const postUrl = `${baseUrl}/attendance-entry-or-exit`
  const reader = new FileReader()
  reader.readAsText(datFile)
  reader.onload = async () => {
    //  aJAXPostRequest(postUrl, convertDatToJson(reader.result))
    const api = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertDatToJson(reader.result)),
    })
    const data = await api.json()
    console.log(data)

    fileStatus.textContent = 'uploaded'

    reader.onerror = (error) => {
      console.log(error);
    }
  }
})

//
function convertDatToJson(data) {
  const getData = data.split('\r\n');
  const splitTab = [...getData].map((item) => item.split('\t'));
  const attendanceObject = splitTab.map((item) => ({
    finger_id: item[0],
    name: item[1],
    time: item[2],
  }))
  return attendanceObject;
}


