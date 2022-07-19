function readURL(input) {
  console.log(input)
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    console.log(reader);
    reader.onload = function (e) {
      console.log(e);
      document.querySelector('#img').setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
const input = document.getElementById('edit')
input.addEventListener('change',() => {
  readURL(input)
})
