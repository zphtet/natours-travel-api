console.log('hello');

import { login } from './login.js';
import { Alert } from './alert.js';
// loggin
const btn = document.querySelector('.login-form .btn');
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
