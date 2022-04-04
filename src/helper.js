const test = () => 'test'

const getDateFormat = (date) => {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  today = `${yyyy}-${mm}-${dd}`;

  return today;
}
//  AJAX post request function
const aJAXPostRequest = (url, values) => new Promise((resolve, reject) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      if (data.success) {
        alert('Option Value Updated');
      }
    })
    .catch((err) => console.log(err));
  // return window.location.replace('/options/holiday');
})

// function for date diff
const dateDiff = (dateOne, dateTwo) => {
  const date1 = new Date(dateOne);
  const date2 = new Date(dateTwo);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}
//
//
const dateFormate = (date) => {
  if (date === null) {
    return null;
  }
  const today = new Date(date);
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const getDate = `${year}-${month < 10 ? `0${month}` : month}-${day}`;

  return getDate;
}

// get current date
const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
}

// Date change to date icon active remove

const iconCheck = (e) => {
  const dateIcon = document.querySelector('#date-icon');
  const iconActive = dateIcon.classList.contains('date-icon-active');
  if (iconActive) {
    return dateIcon.classList.remove('date-icon-active');
  }
}

function formValidation() {
  const saveBtn = document.querySelector('.submit-btn');
  const form = document.querySelector('form');
  const addModal = document.querySelector('#myModal')
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const error = []
    const errorPlaceholders = document.querySelectorAll('p.error');
    for (let i = 0; i < errorPlaceholders.length; i++) {
      errorPlaceholders[i].style.display = 'none';
    }
    const inputErrors = document.querySelectorAll('input.error');
    if (inputErrors.length > 0) {
      for (let j = 0; j < inputErrors.length; j++) {
        inputErrors[j].classList.remove('error');
      }
    }
    const formData = new FormData(form);
    // eslint-disable-next-line no-restricted-syntax
    for (const x of formData.entries()) {
      if (x[1] === '') {
        const fieldName = x[0];
        error.push(fieldName)
        console.log(error)
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const fieldName of error) {
        const errorPlaceholder = document.querySelector(`.${fieldName}-error`);
        errorPlaceholder.textContent = `${fieldName} is required!`;
        errorPlaceholder.style.display = 'block';
      }
    }
    const select = document.querySelector('select')
    if (select) {
      if (document.querySelector('select').options.selectedIndex === 0) {
        const fieldName = 'select'
        const errorPlaceholder = document.querySelector(`.${fieldName}-error`);
        errorPlaceholder.textContent = `${fieldName} is required!`;
        errorPlaceholder.style.display = 'block';
        error.push(fieldName)
      }
    }

    console.log(error)

    if (error.length === 0) {
      form.submit()
      form.reset()
      addModal.style.display = 'none';
    }
  });
}

// delete function
function deleteData(deleteUrl) {
  const deleteData = document.querySelectorAll('.delete-data');
  const deleteModal = document.querySelector('.delete-modal');
  const deleteId = document.querySelectorAll('.delete-id');
  const deleteBtn = document.querySelectorAll('.modal-delete-btn');
  const cancelBtn = document.querySelectorAll('.modal-cancel-btn');
  for (let i = 0; i < deleteData.length; i++) {
    deleteData[i].addEventListener('click', () => {
      // alert("delete");
      deleteModal.style.display = 'block';
      console.log(deleteId[i].value);

      deleteBtn[0].addEventListener('click', () => {
        console.log(deleteId[i].value);
        window.location.href = `${deleteUrl}${deleteId[i].value}`;
      });
      cancelBtn[0].addEventListener('click', () => {
        deleteModal.style.display = 'none';
      });
    });
  }
}
// fuction for dynamic report title
function setReportTitle(startDate, endDate) {
  const reportTitle = document.querySelector('.report-title')
  return reportTitle.innerHTML = `Date Between <b>${startDate}</b> and <b>${endDate || getCurrentDate()}</b>`
}
// exports.getDateFormat = { getDateFormat, aJAXPostRequest };

export {
  getDateFormat,
  aJAXPostRequest,
  dateDiff,
  dateFormate,
  getCurrentDate,
  iconCheck,
  test,
  formValidation,
  deleteData,
  setReportTitle,
};
