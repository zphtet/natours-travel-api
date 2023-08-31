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
settingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = await fetch('http://localhost:8000/api/users/updateinfo', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: setName.value,
      email: setEmail.value,
    }),
  });
  const data = await user.json();

  console.log(data);
});
