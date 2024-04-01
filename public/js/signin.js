import axios from 'axios';
import { showAlert } from './alerts';

function setCookie(email, path) {
  const date = toString(Date.now() + 600000);
  document.cookie = `email=${email};expires=${date},path=${path}`;
}

export const signin = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      setCookie(email, '/acctivation-page');
      showAlert('bg-lime-400', 'Please acctivate account.');
      window.setTimeout(() => {
        location.assign('/acctivation-page');
      }, 1500);
    }
  } catch (err) {
    showAlert('bg-red-300', err.response.data.message);
  }
};

export const acctivation = async (acctivationCode) => {
  try {
    console.log(acctivationCode);
    console.log(document.cookie);
    const email = document.cookie.split(';')[0].split('=')[1];
    console.log(email);
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/acctivate-account',
      data: {
        acctivationCode,
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('bg-lime-400', 'Welcome.');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    showAlert('bg-red-300', err.response.data.message);
  }
};
