const searchBtn = document.querySelector('#search-btn');
const continueBtn = document.querySelector('#continue-btn');
const cancleBtn = document.querySelector('#cancle-btn');
const details = document.getElementById('details');
const mailInput = document.getElementById('mail-input');
const errorMsg = document.querySelector('#error-msg');

searchBtn.addEventListener('click', async (e) => {
  const email = document.getElementById('email').value;
  e.preventDefault();
  if (email.length > 1) {
    if (errorMsg.innerText) {
      errorMsg.innerText = '';
    }
    const result = await fetch('/search-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const user = await result.json();
    if (user.result) {
      const mail = user.result[0].user_mail;
      details.innerText = 'How do you want to receive the code to reset your password?';
      mailInput.innerHTML = `
    <div class="mail-sent">
          <p class="mail-title">Recover via email</p>
           <p class="mail-text"> ${mail}</p>
        </div>
    `;
      continueBtn.style.display = 'inline';
      searchBtn.style.display = 'none';
      continueBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const result = await fetch('/recover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: mail }),
        });
        const data = await result.json();
        if (data.result) {
          details.innerText = 'Please check your emails for a message with your recover password';
          mailInput.innerHTML = `
    <div class="mail-sent">
          <p class="mail-title">We sent your recover link to</p>
           <p class="mail-text"> ${data.email}</p>
        </div>
    `;
          continueBtn.style.display = 'none';
          cancleBtn.innerText = 'Go Back';
        }
      });
    } else if (user.errors) {
      errorMsg.innerText = user.errors.common.msg;
    }
  } else {
    errorMsg.innerText = 'Email is required'
  }
});
