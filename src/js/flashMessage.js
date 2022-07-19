setTimeout((event) => {
  const tar = document.querySelector('.close');
  removeThis(tar);
}, 3000);
function removeThis(ele) {
  ele.parentNode.remove();
}
