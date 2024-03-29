import {
    aJAXPostRequest, deleteData, formValidation
} from './helper.js';

const actionBtn = document.querySelectorAll('.action-btn');
const updateBtn = document.querySelectorAll('.update-btn');
const deleteBtn = document.querySelectorAll('.delete-btn');
const saveBtn = document.querySelectorAll('.save-btn');
const projectId = document.querySelectorAll('.project-id');
const projectName = document.querySelectorAll('.title-value');
const projectDetails = document.querySelectorAll('.project-details');
const optCancelBtn = document.querySelectorAll('.opt-cancel-btn');
//
for (let i = 0; i < actionBtn.length; i++) {
  actionBtn[i].addEventListener('click', () => {
    actionBtn[i].style.display = 'none';
    updateBtn[i].style.display = 'block';
    deleteBtn[i].style.display = 'block';
  });
}

// when click on update button
for (let i = 0; i < updateBtn.length; i++) {
  updateBtn[i].addEventListener('click', () => {
    updateBtn[i].style.display = 'none';
    deleteBtn[i].style.display = 'none';
    saveBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'block';

    projectDetails[i].setAttribute('contenteditable', 'true');
    projectDetails[i].focus();
  });
}
// when click on save button
for (let i = 0; i < saveBtn.length; i++) {
  saveBtn[i].addEventListener('click', () => {
    const pId = projectId[i].value.trim();
    const pName = projectName[i].textContent.trim();
    const pDetails = projectDetails[i].textContent.trim();
    if (pName === '' || pDetails === '') {
      alert('Please fill all the fields');
      return;
    }

    const data = {
      pName,
      pDetails,
      pId,
    };

    aJAXPostRequest('/payroll/update', data);

    projectName[i].textContent = data.pName;
    projectDetails[i].textContent = data.pDetails;
    saveBtn[i].style.display = 'none';
    actionBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    projectName[i].setAttribute('contenteditable', 'false');
    projectDetails[i].setAttribute('contenteditable', 'false');
  });
}
// when click on cancel button
for (let i = 0; i < optCancelBtn.length; i++) {
  optCancelBtn[i].addEventListener('click', () => {
    saveBtn[i].style.display = 'none';
    actionBtn[i].style.display = 'block';
    optCancelBtn[i].style.display = 'none';
    projectName[i].setAttribute('contenteditable', 'false');
    projectDetails[i].setAttribute('contenteditable', 'false');
  });
}
formValidation()
// delete project
deleteData('/payroll/delete/');
