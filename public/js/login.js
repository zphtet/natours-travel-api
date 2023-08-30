import { Alert } from './alert.js';

export const login = async (obj) => {
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
    if (!data.error) {
      Alert('success', 'Login Successful');
      setTimeout(() => {
        window.location.pathname = '/';
      }, 200);
    } else Alert('error', data.message);
  } catch (err) {
    Alert('error', err.message);
  }
};
