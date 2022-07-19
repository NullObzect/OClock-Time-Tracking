/* eslint-disable no-undef */
import Toastify from './toastify.js';

const successToast = Toastify({
  text: 'Profile update successfully',
})

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
const submitBtn = document.querySelector('#user-save-btn')
submitBtn.addEventListener('click', async (e) => {
  const fileField = document.querySelector('input[type="file"]');
  e.preventDefault()
  const formdata = new FormData(form)
  const response = await fetch('/update-profile', {
    method: 'POST',
    body: formdata,
  });
  const result = await response.json()
  if (result.errors) {
  // errors
    Object.keys(result.errors).forEach((fieldName) => {
      // add error class to all inputs
      form[fieldName].classList.add('error');
      // set all error placeholders (p tag) textContent
      const errorPlaceholder = document.querySelector(`.${fieldName}-error`);
      errorPlaceholder.textContent = result.errors[fieldName].msg;
      // make all placeholders visible
      errorPlaceholder.style.display = 'block';
    });
  } else {
    successToast.showToast()
    document.querySelector('p.error').style.display = 'none';
    document.querySelector('#user-cancel-btn').style.display = 'none';
    // reload the page after 1 second
    setTimeout(() => {
      location.href = '/profile'
    }, 2000);
  }
})

// Form Cancel Btn
const form = document.querySelector('form')
const userCancelBtn = document.getElementById('user-cancel-btn');
const userSaveBtn = document.getElementById('user-save-btn');
form.addEventListener('click', () => {
  userSaveBtn.disabled = false
  userCancelBtn.style.display = 'inline';
});

// Select to profile image change

function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector('#img').setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
const input = document.getElementById('edit')
input.addEventListener('change', () => {
  readURL(input)
})

// Click to social image set in profile
function imgSet(link) {
  document.querySelector("input[name='socialImage'").value = link
  userSaveBtn.disabled = false
  document.querySelector('#img').setAttribute('src', link);
}
const googleIcon = document.querySelector('#googleImageIcon')
if (googleIcon) {
  const { image } = googleIcon.dataset
  googleIcon.addEventListener('click', () => {
    imgSet(image)
  })
}
const facebookIcon = document.querySelector('#facebookImageIcon')
if (facebookIcon) {
  const { image } = facebookIcon.dataset
  facebookIcon.addEventListener('click', () => {
    imgSet(image)
  })
}
