const loader = document.getElementById('pageLoad')

window.onload = () => {
  setTimeout(() => {
    loader.style.display = 'none'
  }, 1000)
}
