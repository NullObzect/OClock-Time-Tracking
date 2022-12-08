const htmlTextMessage = {
  sendRequestLeave: (name, type, start, end, duration) => (`<div id="search-modal">
        <div style="width: 450px;
        height: 320px;
        margin: 50px auto;
        background: #FFFFFF;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25), 0px 27px 42px rgba(0, 0, 0, 0.2);
        border-radius: 20px;">
            <img class="login-logo" src="https://i.imgur.com/bRevMXT.png" alt="">        
          <hr>
            <div style="min-height: 130px;
            padding: 12px 20px;
            font-size: 20px;
            line-height: 26px;">
              Hi,Boss <br>
              Request for leave <br>
              Name : ${name} <br>
              Leave type : ${type} <br>
              Date : ${start} to ${end} <br>
              Duration : ${duration} days
            </div>
            <div class="btn-box">
            <a style="cursor: pointer;" href="${process.env.BASE_URL}/options/request-leave"> <button style="padding: 0px 20px;
              border-radius: 8px;
              background-color: #103047;
              border : none;
              font-size: 15px;
              font-weight: 700;
              line-height: 36px;
              color: #FFFFFF;
              margin-left: 8px;
              text-align: center;
              cursor: pointer;">Request List</button></a>
           </div>
      </div>`),
  acceptRequestLeave: (name, type, start, end, duration) => (`<div id="search-modal">
      <div style="width: 450px;
      height: 320px;
      margin: 50px auto;
      background: #FFFFFF;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25), 0px 27px 42px rgba(0, 0, 0, 0.2);
      border-radius: 20px;">
          <img class="login-logo" src="https://i.imgur.com/bRevMXT.png" alt="">        
        <hr>
          <div style="min-height: 130px;
          padding: 12px 20px;
          font-size: 20px;
          line-height: 26px;">
            Hello, ${name} <br>
            Your leave request Accepcted <br>
            Leave type : ${type} <br>
            Date : ${start} to ${end} <br>
            Duration : ${duration} days

          </div>
    </div>`),
  rejectRequestLeave: (name) => (`<div id="search-modal">
      <div style="width: 450px;
      height: 320px;
      margin: 50px auto;
      background: #FFFFFF;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25), 0px 27px 42px rgba(0, 0, 0, 0.2);
      border-radius: 20px;">
          <img class="login-logo" src="https://i.imgur.com/bRevMXT.png" alt="">        
        <hr>
          <div style="min-height: 130px;
          padding: 12px 20px;
          font-size: 20px;
          line-height: 26px;">
            Hello, ${name} <br>
            Your leave request rejected <br>

          </div>
    </div>`),
  recoverUser: (name, link) => (`<div id="search-modal">
    <div style="width: 450px;
    height: 320px;
    margin: 50px auto;
    background: #FFFFFF;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25), 0px 27px 42px rgba(0, 0, 0, 0.2);
    border-radius: 20px;">
        <img class="login-logo" src="https://i.imgur.com/bRevMXT.png" alt="">        
      <hr>
        <div style="min-height: 130px;
        padding: 12px 20px;
        font-size: 20px;
        line-height: 26px;">
          Hi, ${name} <br>
          We received a request to reset your Oclock profile password.
          Enter the following change password button:
        </div>
         <div class="btn-box">
          <a style="cursor: pointer;"  href="${link}"> <button style="padding: 0px 20px;
            border-radius: 8px;
            background-color: #103047;
            border : none;
            font-size: 15px;
            font-weight: 700;
            line-height: 36px;
            color: #FFFFFF;
            margin-left: 8px;
            text-align: center;
            cursor: pointer;">Change Password</button></a>
         </div>
  </div>`),
  addUser: (name, link) => (`<div id="search-modal">
  <div style="width: 450px;
  height: 320px;
  margin: 50px auto;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25), 0px 27px 42px rgba(0, 0, 0, 0.2);
  border-radius: 20px;">
      <img class="login-logo" src="https://i.imgur.com/bRevMXT.png" alt="">        
    <hr>
      <div style="min-height: 130px;
      padding: 12px 20px;
      font-size: 20px;
      line-height: 26px;">
        Hi, ${name} <br>
        Welcome to Oclock, to active your Oclock profile account.
        Enter the following active account button:
      </div>
       <div class="btn-box">
        <a style="cursor: pointer;" href="${link}"> <button style="padding: 0px 20px;
          border-radius: 8px;
          background-color: #103047;
          border : none;
          font-size: 15px;
          font-weight: 700;
          line-height: 36px;
          color: #FFFFFF;
          margin-left: 8px;
          text-align: center;
          cursor: pointer;">Active account</button></a>
       </div>
</div>`),
  userVerify: (name, link) => (`<div id="search-modal">
<div style="width: 450px;
height: 320px;
margin: 50px auto;
background: #FFFFFF;
box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25), 0px 27px 42px rgba(0, 0, 0, 0.2);
border-radius: 20px;">
    <img class="login-logo" src="https://i.imgur.com/bRevMXT.png" alt="">        
  <hr>
    <div style="min-height: 130px;
    padding: 12px 20px;
    font-size: 20px;
    line-height: 26px;">
      Hi, ${name} <br>
      We received a request to active your Oclock profile account.
      Enter the following active account button:
    </div>
     <div class="btn-box">
      <a style="cursor: pointer;" href="${link}"> <button style="padding: 0px 20px;
        border-radius: 8px;
        background-color: #103047;
        border : none;
        font-size: 15px;
        font-weight: 700;
        line-height: 36px;
        color: #FFFFFF;
        margin-left: 8px;
        text-align: center;
        cursor: pointer;">Active account</button></a>
     </div>
</div>`),
}
module.exports = htmlTextMessage
