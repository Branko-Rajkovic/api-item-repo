export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, message) => {
  const markup = `<div class="alert" style="background-color:${type}">${message}</div>`;
  document.getElementById('header').insertAdjacentHTML('beforeend', markup);
  window.setTimeout(hideAlert, 5000);
};
