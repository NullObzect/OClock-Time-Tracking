const navToggle = document.getElementById('nav-toggle')
const navMenu = document.getElementById('bottom-nav-menu')
const navClose = document.getElementById('nav-close')
const modalClose = document.querySelector('.modal-close')
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

const currentLocation = location.href.split('/')[3]
const navMenuUl = document.querySelector('.nav-list')
const navList = navMenuUl.querySelectorAll('li')
for (let i = 0; i < navList.length; i++) {
  const aa = navList[i].querySelector('a').href.split('/')[3]
  if (!currentLocation.search(aa)) {
    navList[i].classList.add('active')
  }
}

const bottomNavMenuUl = document.querySelector('.bottom-nav-list')
const bottomNavList = bottomNavMenuUl.querySelectorAll('li')
for (let i = 0; i < bottomNavList.length; i++) {
  const aa = bottomNavList[i].querySelector('a').href.split('/')[3]
  if (!currentLocation.search(aa)) {
    bottomNavList[i].classList.add('active-b-nav')
  }
}

// Open modal

const addBtn = document.querySelector('.add-button')
const modal = document.querySelector('#myModal')

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
})

addBtn.addEventListener('click', () => {
  modal.style.display = 'block';
})

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
