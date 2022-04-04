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
  // formdata.append('avatar',fileField.files[0])
  const response = await fetch('/update-profile', {
    method: 'POST',
    body: formdata,
  });
  const result = await response.json()
  console.log(result)
  if (result.errors) {
  // errors
    Object.keys(result.errors).forEach((fieldName) => {
      console.log(fieldName)
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
