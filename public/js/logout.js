// const document
const logoutLink = document.querySelector('.logout');

logoutLink?.addEventListener('click', async function (e) {
  alert('loout');
  await fetch('http://localhost:8000/api/logout');
  setTimeout(() => {
    window.location.pathname = '/';
  }, 100);
});
