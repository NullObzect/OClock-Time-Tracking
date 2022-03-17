const getDateFormat = (date) => {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  today = `${yyyy}-${mm}-${dd}`;

  return today;
}
//  AJAX post request function
const aJAXPostRequest = (url, values) => new Promise((resolve, reject) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      if (data.success) {
        alert('Option Value Updated');
      }
    })
    .catch((err) => console.log(err));
  // return window.location.replace('/options/holiday');
})

// exports.getDateFormat = { getDateFormat, aJAXPostRequest };

export { getDateFormat, aJAXPostRequest };
