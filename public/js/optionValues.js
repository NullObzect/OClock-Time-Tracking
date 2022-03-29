// const helperJs = require('../public/js/halper')
// import { aJAXPostRequest } from './halper.js';

const optionValueChangeBtn = document.querySelectorAll('.opt-val-change-btn');
const optionValueInput = document.querySelectorAll('.option-value');
const optionIdInput = document.querySelectorAll('.optionId');
const optionValueSaveBtn = document.querySelectorAll('.opt-val-save-btn');

for (let i = 0; i < optionValueChangeBtn.length; i += 1) {
  optionValueChangeBtn[i].addEventListener('click', (e) => {
    e.preventDefault();
    optionValueSaveBtn[i].style.display = 'block';
    optionValueChangeBtn[i].style.display = 'none';
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
      alert('Please enter option value');
      return;
    }
    const data = {
      optionValue,
      optionId,
    };
    console.log({ data });
    aJAXPostRequest('/options/option-values/update-option-value', data);

    optionValueSaveBtn[i].style.display = 'none';
    optionValueChangeBtn[i].style.display = 'block';
    optionValueInput[i].textContent = data.optionValue;
  });
}

console.log('hello');
//  AJAX post request function
const aJAXPostRequest = (url, values) => new Promise((resolve, reject) => {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },

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

/*
      fetch("/options/option-values/update-option-value", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionValue: optionValue,
          optionId: optionId,
        }),
      })
        .then((res) => console.log(res))

        .then((data) => {
          console.log({ data });
          if (data.success) {
            alert("Option Value Updated");
          }
        })
        .catch((err) => console.log(err)); */

// return window.location.replace("/options/option-values");
