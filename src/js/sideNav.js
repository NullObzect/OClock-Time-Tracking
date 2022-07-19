const optionsBtn = document.getElementById('options-btn');
const navList = document.querySelector('.nav-list');
const navListLi = navList.querySelectorAll('li');
const subOptions = document.querySelector('.sub-options');
const navLi = document.querySelectorAll('.nav-li');
optionsBtn.addEventListener('click', (e) => {
  e.preventDefault()
})
optionsBtn.addEventListener('mouseover', (e) => {
  subOptions.classList.remove('hidden')
});
subOptions.addEventListener('mouseleave', () => {
  subOptions.classList.add('hidden')
});
navList.querySelectorAll('li');
for (let i = 0; i < navListLi.length; i++) {
  const element = navListLi[i];
  if (element != optionsBtn) {
    element.addEventListener('mouseover', () => {
      subOptions.classList.add('hidden')
    });
  }
}
