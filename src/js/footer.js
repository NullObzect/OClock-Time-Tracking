const loader = document.getElementById('pageLoad')

window.onload = () => {
  setTimeout(() => {
    loader.style.display = 'none'
  }, 1000)
}
const pageSelect = document.querySelector('#pageLimitSelect')
if (pageSelect) {
  pageSelect.addEventListener('change', function () {
    window.location.href = this.value
  })
}
