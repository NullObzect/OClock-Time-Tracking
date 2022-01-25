const navToggle = document.getElementById('nav-toggle')
const navMenu = document.getElementById('bottom-nav-menu')
const navClose = document.getElementById('nav-close')
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu')
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}
const moreButton = document.getElementById('more-btn')
const moreOption = document.getElementById('more-option')
if (moreButton) {
  moreButton.addEventListener('click', () => {
    moreOption.classList.toggle('show-more')
  })
}
const notificationButton = document.querySelector('#notification-btn')
const notification = document.querySelector('#notification')
if (notificationButton) {
  notificationButton.addEventListener('click', () => {
    console.log('ccc')
    console.log(notification)
    notification.classList.toggle('show-more')
  })
}
const bottomNotificationButton = document.querySelector('#bottom-notification-btn')
const notificationShow = document.querySelector('#bottom-notification')
if (notificationShow) {
  bottomNotificationButton.addEventListener('click', () => {
    console.log('ccc')
    console.log(notification)
    notificationShow.classList.toggle('show-more')
  })
}

const currentLocation = location.href
const navMenuUl = document.querySelector('.nav-list')
const navList = navMenuUl.querySelectorAll('li')
const navLink = navMenuUl.querySelectorAll('a')
for (let i = 0; i < navList.length; i++) {
  const aa = navList[i].querySelector('a')
  if (aa.href == currentLocation) {
    navList[i].classList.add('active')
  }
}

// Open modal

const addBtn = document.querySelector('.add-button')
const modal = document.querySelector('#myModal')
addBtn.addEventListener('click', () => {
  modal.style.display = 'block';
})
function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}