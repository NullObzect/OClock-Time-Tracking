const test = () => 'test'

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

// function for date diff
const dateDiff = (dateOne, dateTwo) => {
  const date1 = new Date(dateOne);
  const date2 = new Date(dateTwo);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}
//
//
const dateFormate = (date) => {
  if (date === null) {
    return null;
  }
  const today = new Date(date);
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const getDate = `${year}-${month < 10 ? `0${month}` : month}-${day}`;

  return getDate;
}

// get current date
const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
}

// Date change to date icon active remove

const iconCheck = (e) => {
  const dateIcon = document.querySelector('#date-icon');
  const iconActive = dateIcon.classList.contains('date-icon-active');
  if (iconActive) {
    return dateIcon.classList.remove('date-icon-active');
  }
}


// exports.getDateFormat = { getDateFormat, aJAXPostRequest };

export {
  getDateFormat,
  aJAXPostRequest,
  dateDiff,
  dateFormate,
  getCurrentDate,
  iconCheck,
  test,
};
