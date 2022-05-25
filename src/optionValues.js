import Toastify from './toastify.js';

const inputWarning = Toastify({
  text: 'Please enter option value',
  className: 'info',
})
const successToast = Toastify({
  text: 'Change Successfully',
  className: 'info',
})

const optionValueChangeBtn = document.querySelectorAll('.opt-val-change-btn');
const optionValueInput = document.querySelectorAll('.option-value');
const optionIdInput = document.querySelectorAll('.optionId');
const optionValueSaveBtn = document.querySelectorAll('.opt-val-save-btn');
const optCancelBtn = document.querySelectorAll('.opt-cancel-btn');

for (let i = 0; i < optionValueChangeBtn.length; i += 1) {
  optionValueChangeBtn[i].addEventListener('click', (e) => {
    e.preventDefault();
    optionValueSaveBtn[i].style.display = 'block';
    optionValueChangeBtn[i].style.display = 'none';
    optCancelBtn[i].style.display = 'block';
    // optionValueInput[i].classList.add("bottom-border", "option-value-focus");
    optionValueInput[i].focus();
  });
}
// when user click on save button
for (let i = 0; i < optionValueSaveBtn.length; i += 1) {
  optionValueSaveBtn[i].addEventListener('click', (e) => {
    e.preventDefault();
    const optionValue = optionValueInput[i].value;

    const optionId = optionIdInput[i].value;
    if (optionValue === '') {
      inputWarning.showToast();
      return;
    }
    const data = {
      optionValue,
      optionId,
    };
    aJAXPostRequest('/options/option-values/update-option-value', data);

    optionValueSaveBtn[i].style.display = 'none';
    optionValueChangeBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    optionValueInput[i].textContent = data.optionValue;
  });
}
// when click option button
for (let i = 0; i < optCancelBtn.length; i += 1) {
  optCancelBtn[i].addEventListener('click', (e) => {
    e.preventDefault();
    optionValueSaveBtn[i].style.display = 'none';
    optionValueChangeBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
  });
}
//  AJAX post request function
const aJAXPostRequest = (url, values) => new Promise((resolve, reject) => {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },

    body: JSON.stringify(values),
  }).then((res) => {
    if (res.status === 200) {
      successToast.showToast()
    }
  })
    .catch((err) => console.log(err));
})

const offDayAddBtn = document.querySelector('#offDayAddBtn')
const offDayAddModal = document.querySelector('#offDayAddModal')
const offDayAddModalClose = document.querySelector('#off-day-modal-close')
if (offDayAddBtn) {
  offDayAddBtn.addEventListener('click', () => {
    console.log(offDayAddBtn)
    offDayAddModal.style.display = 'block'
  })
}
if (offDayAddModalClose) {
  offDayAddModalClose.addEventListener('click', () => {
    offDayAddModal.style.display = 'none'
  })
}

console.log(offDayAddBtn)
console.log(offDayAddModal)
