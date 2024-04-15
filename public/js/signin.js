import axios from 'axios';
import { showAlert } from './alerts';

function setCookie(email, path) {
  const date = toString(Date.now() + 600000);
  document.cookie = `email=${email};expires=${date},path=${path}`;
}

export const signin = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data,
    });

    console.log(res.data.data.email);
    if (res.data.status === 'success') {
      const email = res.data.data.email;
      setCookie(email, '/acctivation-page');
      showAlert('green', 'Please acctivate account.');
      window.setTimeout(() => {
        location.assign('/acctivation-page');
      }, 1500);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
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
      showAlert('green', 'Welcome.');
      window.setTimeout(() => {
        location.assign('/account');
      }, 200);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};

export const deleteUsers = async (usersToDelete) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: 'http://127.0.0.1:3000/api/v1/users',
      data: {
        usersToDelete,
      },
    });

    if (res.data.status === 'success') {
      showAlert('green', 'users are delteted');
      window.setTimeout(() => {
        location.assign('/manage-users');
      }, 200);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};
