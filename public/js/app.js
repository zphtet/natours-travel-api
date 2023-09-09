import { login } from './login.js';
import { Alert } from './alert.js';

let URL = window.location.origin;
// URL = process.env.PORT;
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
  await fetch(`${URL}/api/logout`);
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

  const user = await fetch(`${URL}/api/users/updateinfo`, {
    method: 'PATCH',
    body: fdata,
  });
  const data = await user.json();
  if (data.status === 'success') location.reload();
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

  const resp = await fetch(`${URL}/api/updatepassword`, {
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

// Booking tour

const bookTourBtn = document.querySelector('#book-tour-btn');

bookTourBtn?.addEventListener('click', async function (e) {
  console.log(this.dataset.tourid);
  const { tourid } = this.dataset;
  const resp = await fetch(`${URL}/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tourid,
    }),
  });
  const data = await resp.json();
  window.location.href = data.url;
});

// signup
const signupForm = document.querySelector('.signup-form');
const signupName = document.querySelector('.signup-form #name');
const singupEmail = document.querySelector('.signup-form #email');
const singupPassword = document.querySelector('.signup-form #password');
const signupBtn = document.querySelector('.signup-form button');
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!signupName.value || !singupEmail.value || !singupPassword.value) return;

  const signupObj = {
    name: signupName.value,
    email: singupEmail.value,
    password: singupPassword.value,
  };

  console.log('singn up', signupObj);
  signupBtn.innerHTML = 'signing up...';
  const resp = await fetch(`${URL}/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupObj),
  });
  const data = await resp.json();
  signupBtn.innerHTML = 'Finished';
  if (data.status == 'success') {
    Alert('success', 'Signup Successfull ');
    window.location.pathname = '/';
  } else {
    Alert('error', 'Error in Signup ');
  }
});
