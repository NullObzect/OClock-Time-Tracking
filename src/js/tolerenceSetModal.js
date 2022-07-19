const selectBox = document.getElementsByClassName('select-box')
const toleAddBtn = document.querySelector('#toleAddBtn')
const currentToleValue = document.querySelector('#toleAddBtn').value
let toleValue;
let currentElement;
toleValue = currentToleValue
for (let i = 0; i < selectBox.length; i++) {
  if (currentToleValue == selectBox[i].querySelector('input').value) {
    selectBox[i].classList.add('select')
    currentElement = selectBox[i]
  }

  selectBox[i].addEventListener('click', (e) => {
    const element = e.target
    element.classList.add('select');

    for (let i = 0; i < selectBox.length; i++) {
      if (selectBox[i] != element) {
        if (selectBox[i].classList.contains('select')) {
          selectBox[i].classList.remove('select')
        }
      }
    }
    const inputToleValue = element.querySelector('input').value
    toleValue = inputToleValue
    toleAddBtn.value = toleValue
  })
}
