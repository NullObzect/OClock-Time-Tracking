/* eslint-disable prefer-const */
const form = document.querySelector('form')
const userName = document.getElementById('userName')
const userPass = document.getElementById('userPass')
const errorMsg = document.getElementById('error-msg')
form.addEventListener('submit', (e) => {
  let errorMessage = ''
  if (userName.value === '' || userName.value === null) {
    errorMessage = 'UserName requiered'
  } else if (userPass.value.length === 0) {
    errorMessage = 'Password requierd'
  }
  if (errorMessage.length >= 0) {
    e.preventDefault()
    errorMsg.innerText = errorMessage
  }
  if (errorMessage.length === 0) {
    form.submit()
  }
})
