import { login } from './login.js';
import { Alert } from './alert.js';
// login
const btn = document.querySelector('.login-form .login');
btn?.addEventListener('click', function (e) {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return Alert('error', 'Invalid Email or Password');
  const loginObj = {
    email,
    password,
  };
  login(loginObj);
});

// logout
const logoutLink = document.querySelector('.logout');

logoutLink?.addEventListener('click', async function (e) {
  alert('Want to loguout ?');
  Alert('success', 'logging out .... ');
  await fetch('http://localhost:8000/api/logout');
  setTimeout(() => {
    window.location.pathname = '/';
  }, 100);
});

// user settings

const settingForm = document.querySelector('.form-user-data');
const setName = document.querySelector('.form-user-data #name');
const setEmail = document.querySelector('.form-user-data #email');
const setPhoto = document.querySelector('.form-user-data #photo');
settingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  console.dir(setPhoto.files[0]);

  const fdata = new FormData();
  fdata.append('photo', setPhoto.files[0]);
  fdata.append('name', setName.value);
  fdata.append('email', setEmail.value);

  const user = await fetch('http://localhost:8000/api/users/updateinfo', {
    method: 'PATCH',
    body: fdata,
  });
  const data = await user.json();
  if (data.status === 'success') location.reload();

  // const user = await fetch('http://localhost:8000/api/users/updateinfo', {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     name: setName.value,
  //     email: setEmail.value,
  //   }),
  // });

  // const fdata = new FormData();
  // fdata.append('photo', setPhoto.files[0]);
  // fdata.append('name', 'david backend');
  // // console.log(data);
  // const resp = await fetch('http://localhost:8000/uploadphoto', {
  //   method: 'PATCH',
  //   body: fdata,
  // });
  // const data = await resp.json();
  // console.log(data);
});

// update password

const passwordForm = document.querySelector('.form-user-settings');

const curPassInput = passwordForm?.querySelector('#password-current');
const passInput = passwordForm?.querySelector('#password');
const passConfirmInput = passwordForm?.querySelector('#password-confirm');

passwordForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const passObj = {
    currentPassword: curPassInput.value,
    newPassword: passInput.value,
    confirmNewPassword: passConfirmInput.value,
  };

  const resp = await fetch('http://localhost:8000/api/updatepassword', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passObj),
  });
  const data = await resp.json();
  if (data.status == 'success') {
    Alert('success', 'Password Changed Successfully ');
    setTimeout(() => {
      alert('Login Again');
      window.location.pathname = '/login';
    }, 1000);
  }
});
