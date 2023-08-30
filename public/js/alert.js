export const Alert = (type, message) => {
  const body = document.querySelector('body');
  const div = document.createElement('div');
  div.className = `alert alert--${type}`;
  div.innerHTML = `${message}`;
  body.prepend(div);
  setTimeout(() => {
    div.remove();
  }, 2000);
};
