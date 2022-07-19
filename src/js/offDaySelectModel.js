const selectBtn = document.getElementsByClassName('select-btn')
const offDayInput = document.querySelector('#offDayAddBtn')
const offDayAddBtn = document.querySelector('#offDayAddBtn').value
let currentValue;
if (offDayAddBtn.length > 5) {
  currentValue = offDayAddBtn.split(',')
} else {
  currentValue = [offDayAddBtn]
}
const values = []
values.push(...currentValue)
for (var i = 0; i < selectBtn.length; i++) {
  currentValue.map((v) => {
    if (v == selectBtn[i].querySelector('input').value) {
      selectBtn[i].classList.add('select')
    }
  })
  selectBtn[i].addEventListener('click', (e) => {
    const element = e.target
    element.classList.toggle('select');
    const inputValue = element.querySelector('input').value
    const find = (el) => el == inputValue
    const duplicate = values.some(find)
    if (duplicate) {
      const index = values.indexOf(inputValue)
      values.splice(index, 1)
    } else {
      values.push(inputValue)
    }
    offDayInput.value = values
  })
}
