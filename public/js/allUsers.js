// event for  user profile
// base URL
const userCard = document.querySelector('#user-card');
const userDetails = document.querySelector('#user-details');
const userCancle = document.querySelector('#user-x');
const getUserView = (event) => {
  const userId = event.target.dataset.id;
  // eslint-disable-next-line no-unused-expressions
  userId ? userCard.classList.add('user-card-center') : '';

  fetch(`${baseUrl}/user/view?userId=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      userDetails.innerHTML = data
        .map(
          (user, idx) => `
              <div class="flex justify-between">
                  <h4 class="md:text-2xl font-semibold text-gray-200 mt-4">${user.user_name}</h4>
                <div class="text-white text-right ml-8  mt-5"><small class="text-xs">${user.date}</small></div>
              </div>
          <div class="flex justify-between text-white font-medium">
              
              <div class="flex-1 mt-2">
                <p>Role:</p>
                <p>Phone : </p>
                <p>Mail :</p>
              </div>
              <div class="flex-1 mt-2">
                <p>${user.user_role}</p>
                <p> ${user.user_phone}</p>
                <p>${user.user_mail}</p>
              </div>

          </div>
          `,
        )
        .join('');
    });

  userCancle.addEventListener('click', () => {
    userCancle.parentElement.remove();
    location.reload();
  });
};

// event for user search
const userList = document.querySelector('#user-list');
console.log('=====>', userList);

const getSearchUser = (event) => {
  const userName = event.target.value;

  console.log({ userName });

  fetch(`${baseUrl}/search/user?userName=${userName}`)
    .then((res) => res.json())
    .then((data) => {
      userList.innerHTML = data
        .map(
          (user, idx) => `
            <tr class="bg-blue-200 lg:text-black">  
            <td class="p-2">
            <div class="flex align-items-center">
             
              <img
                class="rounded-full h-12 w-12 object-cover"
                src="uploads/avatars/${user.avatar || 'demo_profile.png'}"/>
              
              <div class="ml-3">
                <div class="">${user.user_name}</div>
                <div class="text-gray-500">${user.user_mail}</div>
              </div>
            </div>
            </td>
          <td class="p-2">${user.user_phone}</td>
          <td class="p-2 uppercase">${user.user_role}</td>

          <td class="p-2">
            <span class="bg-green-400 text-gray-50 rounded-md px-2"
              >ACTIVE</span
            >
          </td>
          <td class="p-2">
            <a href="#" class="text-gray-500 hover:text-gray-100 mr-2">
              <i
                class="material-icons-outlined text-base"
                onclick="getUserView(event)"
                data-id="${user.id}"
                >visibility</i
              >
            </a>
            <a href="#" class="text-yellow-400 hover:text-gray-100 mx-2">
              <i class="material-icons-outlined text-base">edit</i>
            </a>
            <a
              onclick="return confirm('Are you Sure?')"
              href="/delete/user/${user.id}"
              class="text-red-400 hover:text-gray-100 ml-2"
            >
              <i class="material-icons-round text-base">delete_outline</i>
            </a>
          </td>
        </tr>
          
          `,
        )
        .join('');
    });
};
  // End user search event
  // show users onclick user button
const getUsers = (event) => {
  const user = event.target.value;
  console.log({ user });

  fetch(`${baseUrl}/users-list?user=${user}`)
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      userList.innerHTML = data
        .map(
          (user, idx) => `
            <tr class="bg-blue-200 lg:text-black">  
            <td class="p-2">
            <div class="flex align-items-center">
             
              <img
                class="rounded-full h-12 w-12 object-cover"
                src="uploads/avatars/${user.avatar || 'demo_profile.png'}"/>
              
              <div class="ml-3">
                <div class="">${user.user_name}</div>
                <div class="text-gray-500">${user.user_mail}</div>
              </div>
            </div>
            </td>
          <td class="p-2">${user.user_phone}</td>
          <td class="p-2 uppercase">${user.user_role}</td>

          <td class="p-2">
            <span class="bg-green-400 text-gray-50 rounded-md px-2"
              >ACTIVE</span
            >
          </td>
          <td class="p-2">
            <a href="#" class="text-gray-500 hover:text-gray-100 mr-2">
              <i
                class="material-icons-outlined text-base"
                onclick="getUserView(event)"
                data-id="${user.id}"
                >visibility</i
              >
            </a>
            <a href="#" class="text-yellow-400 hover:text-gray-100 mx-2">
              <i class="material-icons-outlined text-base">edit</i>
            </a>
            <a
              onclick="return confirm('Are you Sure?')"
              href="/delete/user/${user.id}"
              class="text-red-400 hover:text-gray-100 ml-2"
            >
              <i class="material-icons-round text-base">delete_outline</i>
            </a>
          </td>
        </tr>
          
          `,
        )
        .join('');
    });
};

// show admin onclick admin button
const getAdmin = (event) => {
  const admin = event.target.value;
  console.log({ admin });

  fetch(`${baseUrl}/admin-list?admin=${admin}`)
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      userList.innerHTML = data
        .map(
          (user, idx) => `
            <tr class="bg-blue-200 lg:text-black">  
            <td class="p-2">
            <div class="flex align-items-center">
             
              <img
                class="rounded-full h-12 w-12 object-cover"
                src="uploads/avatars/${user.avatar || 'demo_profile.png'}"/>
              
              <div class="ml-3">
                <div class="">${user.user_name}</div>
                <div class="text-gray-500">${user.user_mail}</div>
              </div>
            </div>
            </td>
          <td class="p-2">${user.user_phone}</td>
          <td class="p-2 uppercase">${user.user_role}</td>

          <td class="p-2">
            <span class="bg-green-400 text-gray-50 rounded-md px-2"
              >ACTIVE</span
            >
          </td>
          <td class="p-2">
            <a href="#" class="text-gray-500 hover:text-gray-100 mr-2">
              <i
                class="material-icons-outlined text-base"
                onclick="getUserView(event)"
                data-id="${user.id}"
                >visibility</i
              >
            </a>
            <a href="#" class="text-yellow-400 hover:text-gray-100 mx-2">
              <i class="material-icons-outlined text-base">edit</i>
            </a>
            <a
              onclick="return confirm('Are you Sure?')"
              href="/delete/user/${user.id}"
              class="text-red-400 hover:text-gray-100 ml-2"
            >
              <i class="material-icons-round text-base">delete_outline</i>
            </a>
          </td>
        </tr>
          
          `,
        )
        .join('');
    });
};

// Show usrs sort by Asecending order

const getUsersSortByASC = (event) => {
  console.log(event.target.value);
  console.log(baseUrl);
  const userName = event.target.value;
  fetch(`${baseUrl}/async/users/list?userName=${userName}`)
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      userList.innerHTML = data
        .map(
          (user, idx) => `
            <tr class="bg-blue-200 lg:text-black">  
            <td class="p-2">
            <div class="flex align-items-center">
             
              <img
                class="rounded-full h-12 w-12 object-cover"
                src="uploads/avatars/${user.avatar || 'demo_profile.png'}"/>
              
              <div class="ml-3">
                <div class="">${user.user_name}</div>
                <div class="text-gray-500">${user.user_mail}</div>
              </div>
            </div>
            </td>
          <td class="p-2">${user.user_phone}</td>
          <td class="p-2 uppercase">${user.user_role}</td>

          <td class="p-2">
            <span class="bg-green-400 text-gray-50 rounded-md px-2"
              >ACTIVE</span
            >
          </td>
          <td class="p-2">
            <a href="#" class="text-gray-500 hover:text-gray-100 mr-2">
              <i
                class="material-icons-outlined text-base"
                onclick="getUserView(event)"
                data-id="${user.id}"
                >visibility</i
              >
            </a>
            <a href="#" class="text-yellow-400 hover:text-gray-100 mx-2">
              <i class="material-icons-outlined text-base">edit</i>
            </a>
            <a
              onclick="return confirm('Are you Sure?')"
              href="/delete/user/${user.id}"
              class="text-red-400 hover:text-gray-100 ml-2"
            >
              <i class="material-icons-round text-base">delete_outline</i>
            </a>
          </td>
        </tr>
          
          `,

        ).join('')
    });
};

// Show usrs sort by Decsending order

const getUsersSortByDESC = (event) => {
  const userName = event.target.value;
  fetch(`${baseUrl}/desc/users/list?userName=${userName}`)
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      userList.innerHTML = data
        .map(
          (user, idx) => `
              <tr class="bg-blue-200 lg:text-black">  
              <td class="p-2">
              <div class="flex align-items-center">
               
                <img
                  class="rounded-full h-12 w-12 object-cover"
                  src="uploads/avatars/${user.avatar || 'demo_profile.png'}"/>
                
                <div class="ml-3">
                  <div class="">${user.user_name}</div>
                  <div class="text-gray-500">${user.user_mail}</div>
                </div>
              </div>
              </td>
            <td class="p-2">${user.user_phone}</td>
            <td class="p-2 uppercase">${user.user_role}</td>

            <td class="p-2">
              <span class="bg-green-400 text-gray-50 rounded-md px-2"
                >ACTIVE</span
              >
            </td>
            <td class="p-2">
              <a href="#" class="text-gray-500 hover:text-gray-100 mr-2">
                <i
                  class="material-icons-outlined text-base"
                  onclick="getUserView(event)"
                  data-id="${user.id}"
                  >visibility</i
                >
              </a>
              <a href="#" class="text-yellow-400 hover:text-gray-100 mx-2">
                <i class="material-icons-outlined text-base">edit</i>
              </a>
              <a
                onclick="return confirm('Are you Sure?')"
                href="/delete/user/${user.id}"
                class="text-red-400 hover:text-gray-100 ml-2"
              >
                <i class="material-icons-round text-base">delete_outline</i>
              </a>
            </td>
          </tr>
            
            `,
        )
        .join('');
    });
};
