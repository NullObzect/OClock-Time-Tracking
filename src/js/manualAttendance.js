/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
const baseUrl = process.env.BASE_URL

function showToast(message, type) {
  const successToast = Toastify({
    text: message,
    className: `${type}`,
  })
  return successToast.showToast()
}

const userId = document.querySelector('#userId');
const submit = document.querySelector('#submit-btn');
const isExist = document.querySelector('.isExist-attdance');

const manualDate = (event) => {
  const date = event.target.value;

  fetch(
    `${baseUrl}/manual-attendance-exist?date=${date}&userId=${userId.value}`,
  )
    .then((res) => res.json())

    .then((data) => {
      if (data.length > 0) {
        isExist.textContent = 'Attendance Already Exist';
        isExist.style.color = 'red';
        const errorPlaceholder = document.querySelector('date-error');
        errorPlaceholder.style.display = 'none';
      } else {
        isExist.textContent = '';
      }
    });
};
document.querySelector('#manualDate').addEventListener('change', (e) => {
  manualDate(e)
})

submit.addEventListener('click', (e) => {
  e.preventDefault();
  const bodyData = {};
  const error = [];
  const modal = document.querySelector('#myModal')
  const form = document.querySelector('#manualForm');
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
  const select = document.querySelector('select');
  if (select) {
    if (document.querySelector('select').options.selectedIndex === 0) {
      const fieldName = 'employee';
      const errorPlaceholder = document.querySelector(`.${fieldName}-error`);
      errorPlaceholder.textContent = `${fieldName} is required!`;
      errorPlaceholder.style.display = 'block';
      error.push(fieldName);
    }
  }
  const formData = new FormData(form);
  // eslint-disable-next-line no-restricted-syntax
  for (const [name, value] of formData.entries()) {
    if (name == 'date' && value == '') {
      error.push(name);
    }
    bodyData[name] = value;
  }
  for (const fieldName of error) {
    const errorPlaceholder = document.querySelector(`.${fieldName}-error`);
    errorPlaceholder.textContent = `${fieldName} is required!`;
    errorPlaceholder.style.display = 'block';
  }
  console.log(form)
  console.log(error)
  if (error.length === 0) {
    fetch('/manual-attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.type == 'warning') {
          showToast(data.msg, 'warning')
        } else {
          showToast(data.msg, 'info')
          modal.style.display = 'none';
          setTimeout(() => {
            window.location.assign(`${baseUrl}/dashboard`)
          }, 1000)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
});
