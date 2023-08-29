// import axios from 'axios';
// const axios = require('axios/dist/browser/axios.cjs');

// const { default: fetch } = require('node-fetch');
// import fetch from './node-fetch';

// import axios from 'axios';
const btn = document.querySelector('.login-form .btn');

const login = async (obj) => {
  console.log(obj);
  try {
    const resp = await fetch(`http://localhost:8000/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    const data = await resp.json();
    console.log(data);
    if ((data.status = 'success')) {
      alert('Login Successful');
      setTimeout(() => {
        window.location.pathname = '/';
      }, 200);
    } else alert(data.message);
  } catch (err) {
    console.log(err);
  }
};

btn?.addEventListener('click', function (e) {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return alert('Invalid Email or Password');
  const loginObj = {
    email,
    password,
  };
  login(loginObj);
});

console.log('i am from loginjs');

console.dir(fetch);
