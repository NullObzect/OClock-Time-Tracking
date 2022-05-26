const navToggle = document.getElementById('nav-toggle')
const navMenu = document.getElementById('bottom-nav-menu')
const navClose = document.getElementById('nav-close')
const modalClose = document.querySelectorAll('.modal-close')
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
  moreOption.addEventListener('mouseleave', () => {
    moreOption.classList.remove('show-more')
  })
  moreButton.addEventListener('mouseenter', () => {
    moreOption.classList.add('show-more')
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
const deleteModal = document.querySelector('#deleteModal')
const subHover = document.querySelector('.sub-options');

// eslint-disable-next-line no-restricted-syntax
for (const modals of modalClose) {
  modals.addEventListener('click', () => {
    modal.style.display = 'none';
    if (deleteModal) {
      deleteModal.style.display = 'none';
    }
  })
}

if (addBtn) {
  addBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  })
}

window.onclick = function (event) {
  const { target } = event

  if (moreOption) {
    moreOption.classList.remove('show-more')
  }
  if (subHover) {
    subHover.style.display = 'none'
  }

  if (target == modal || target == deleteModal || target == moreOption) {
    modal.style.display = 'none';
    deleteModal.style.display = 'none';
  }
}
function imageSet(avatar, gender) {
  let img;
  if (avatar !== null && avatar.match(/^(http|https):/g)) {
    img = `<img id="img" src=${avatar}/>`
  } else if (avatar != null) {
    img = `<img id="img" src="/uploads/avatars/${avatar}`
  } else if (avatar == null && gender == 'male') {
    img = '<img id="img" src="/uploads/avatars/male-demo-avatar.png'
  } else {
    img = '<img id="img" src="/uploads/avatars/female-demo-avatar.png'
  }
  return img;
}
