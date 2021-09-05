/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
// let menuToggle = document.querySelector(".toggle")
// let navigation = document.querySelector(".navigation")
// menuToggle.onclick = function(){
//   menuToggle.classList.toggle("active")
//   navigation.classList.toggle("active")
// }
const nav = document.querySelector('.navigation')
const list = document.querySelectorAll('.list')
const currentLocation = location.href
const menuItem = nav.querySelectorAll('a')
for (let i = 0; i < menuItem.length; i++) {
  if (menuItem[i].href === currentLocation) {
    list[i].className = 'list active'
  }
}
