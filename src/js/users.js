import Toastify from './toastify.js';

const addUserSuccess = Toastify({
  text: 'User create successfully',
  className: 'info',
})

const form = document.querySelector('#add-user-form');

form.onsubmit = async function (event) {
  event.preventDefault();

  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.innerHTML = ''
  submitBtn.classList.add('loader')
  // clear errors first
  const errorPlaceholders = document.querySelectorAll('p.error');
  for (let i = 0; i < errorPlaceholders.length; i++) {
    errorPlaceholders[i].style.display = 'none';
  }
  const inputErrors = document.querySelectorAll('input.error');
  if (inputErrors.length > 0) {
    for (let j = 0; j < inputErrors.length; j++) {
      inputErrors[j].classList.remove('error');
    }
  }
  const select = document.querySelector('select')
  if (select) {
    if (document.querySelector('select').options.selectedIndex === 0) {
      const fieldName = 'select'
      const errorPlaceholder = document.querySelector(`.${fieldName}-error`);
      errorPlaceholder.textContent = `${fieldName} is required!`;
      errorPlaceholder.style.display = 'block';
    }
  }

  // prepare the form data
  const formData = new FormData(form);
  // send the request to server
  const response = await fetch('/add-user', {
    method: 'POST',
    body: formData,
  });

  // get response
  const result = await response.json();

  // handle error and response
  if (result.errors) {
    submitBtn.innerHTML = 'save'
    submitBtn.classList.remove('loader')
    console.log('remove')
    // errors
    Object.keys(result.errors).forEach((fieldName) => {
      // add error class to all inputs
      form[fieldName].classList.add('error');
      // set all error placeholders (p tag) textContent
      const errorPlaceholder = document.querySelector(`.${fieldName}-error`);
      errorPlaceholder.textContent = result.errors[fieldName].msg;
      // make all placeholders visible
      errorPlaceholder.style.display = 'block';
    });
  } else {
    // // success
    addUserSuccess.showToast();
    document.querySelector('#myModal').style.display = 'none';
    document.querySelector('p.error').style.display = 'none';
    // reload the page after 1 second
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
};

const userMoreBtn = document.querySelectorAll('.user-more-btn');
const userActionBtn = document.querySelectorAll('.user-action-btn');

for (let i = 0; i < userMoreBtn.length; i++) {
  userMoreBtn[i].addEventListener('click', function () {
    const currentMenu = this.childNodes[3];
    const showMenu = document.querySelector('.hidden-menu-show');

    if (!currentMenu.classList.contains('hidden-menu-show') && showMenu) {
      showMenu.classList.remove('hidden-menu-show');
    }
    const btnActive = document.querySelector('.more-active-btn');
    if (
      !userActionBtn[i].classList.contains('more-active-btn')
        && btnActive
    ) {
      btnActive.classList.remove('more-active-btn');
    }

    currentMenu.classList.toggle('hidden-menu-show');
    userActionBtn[i].classList.toggle('more-active-btn');
    // myFun();
  });

  window.addEventListener('click', (e) => {
    if (!e.target.matches('#user-more-btn')) {
      // const showMenu = document.querySelector('.hidden-menu-show');
      // console.log(showMenu);
      // if (showMenu) {
      //   console.log('yes');
      //   // showMenu.classList.remove('hidden-menu-show');
      // }
    }
  });
}

function deleteData(deleteUrl) {
  const deleteData = document.querySelectorAll('.delete-data');
  const deleteModal = document.querySelector('.delete-modal');
  const deleteId = document.querySelectorAll('.delete-id');
  const deleteBtn = document.querySelectorAll('.modal-delete-btn');
  const cancelBtn = document.querySelectorAll('.modal-cancel-btn');
  for (let i = 0; i < deleteData.length; i++) {
    deleteData[i].addEventListener('click', () => {
      // alert("delete");
      deleteModal.style.display = 'block';
      deleteBtn[0].addEventListener('click', () => {
        window.location.href = `${deleteUrl}${deleteId[i].value}`;
      });
      cancelBtn[0].addEventListener('click', () => {
        deleteModal.style.display = 'none';
      });
    });
  }
}
deleteData('/delete/user/');
