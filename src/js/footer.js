const loader = document.getElementById('pageLoad')

window.onload = () => {
  loader.style.display = 'none'
  // setTimeout(() => {
  // }, 1000)
}
const pageSelect = document.querySelector('#pageLimitSelect')
if (pageSelect) {
  pageSelect.addEventListener('change', function () {
    window.location.href = this.value
  })
}
