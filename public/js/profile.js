// account settings
const publicProfileSection = document.getElementById('public-profile');
const publicProfileLi = document.getElementById('public-profile-li');
const accountSettingSection = document.getElementById('account-settings');
const accountSettingLi = document.getElementById('account-setting-li');
accountSettingLi.addEventListener('click', () => {
  publicProfileSection.style.display = 'none';
  accountSettingSection.style.display = 'block';
});
publicProfileLi.addEventListener('click', () => {
  publicProfileSection.style.display = 'block';
});

// modal
const modal = document.querySelector('.main-modal');
const closeButton = document.querySelectorAll('.modal-close');

const modalClose = () => {
  modal.classList.remove('fadeIn');
  modal.classList.add('fadeOut');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
};

const openModal = () => {
  modal.classList.remove('fadeOut');
  modal.classList.add('fadeIn');
  modal.style.display = 'flex';
};

for (let i = 0; i < closeButton.length; i++) {
  const elements = closeButton[i];

  elements.onclick = (e) => modalClose();

  modal.style.display = 'none';

  window.onclick = function (event) {
    if (event.target == modal) modalClose();
  };
}

//  onchange="editName(event)"
const userSaveBtn = document.getElementById('user-save-btn')
const resetBtn = document.getElementById('reset')
userSaveBtn.disabled = true;
resetBtn.disabled = true;
// console.log(userSaveBtn)
// const editName = (event) => {
//   //alert('ok')
//   userSaveBtn.style.background = 'red'
// }

const editName = document.getElementById('edit-name');

editName.addEventListener('keyup', () => {
  // const val = event.target.value
  // if (getValue !== val) {
  userSaveBtn.disabled = true ? userSaveBtn.disabled = false : ''
  resetBtn.disabled = false;

  userSaveBtn.style.background = 'red'
})

// for facebook
const hoverBtn = document.getElementsByClassName('btn-hover-facebook')[0];
// console.log(hoverBtn.textContent);
if (hoverBtn !== undefined) {
  const hoverBtnText = hoverBtn.innerText;
  hoverBtn.addEventListener('mouseenter', () => {
  // alert("ok");
    hoverBtn.innerHTML = '<a href="/remove/facebook">Remove</a>';
  });
  setTimeout(() => {
    hoverBtn.addEventListener('mouseleave', () => {
      hoverBtn.innerHTML = hoverBtnText;
    });
  }, 2000);
}

// for google
const googleHoverBtn = document.getElementsByClassName('btn-hover-google')[0];
if (googleHoverBtn !== undefined) {
  const googleHoverBtnText = googleHoverBtn.innerText;

  googleHoverBtn.addEventListener('mouseenter', () => {
  // alert("ok");
    googleHoverBtn.innerHTML = '<a href="/remove/google">Remove</a>';
  });
  setTimeout(() => {
    googleHoverBtn.addEventListener('mouseleave', () => {
      googleHoverBtn.innerHTML = googleHoverBtnText;
    });
  }, 2000);
}
