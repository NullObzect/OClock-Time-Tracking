const password = document.getElementById('pass').value
const errorMsg = document.getElementById('error-msg')
if (password.length > 1) {
  errorMsg.innerHtml = 'Password is required'
}
