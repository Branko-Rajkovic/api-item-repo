import axios from 'axios';
import { showAlert } from './alerts';

//signin. Only for new user record.
const setCookieAndGetActivationPage = (email) => {
  //const email = res.data.data.email;
  const date = toString(Date.now() + 600000);
  document.cookie = `email=${email};expires=${date},path=/acctivation-page`;
  showAlert('green', 'Please acctivate account.');
  window.setTimeout(() => {
    location.assign('/acctivation-page');
  }, 200);
};

//add new record (item, user or review)
export const addRecord = async (type, data) => {
  try {
    //type = items, users/signup or reviews
    const headers =
      type === 'reviews'
        ? { 'content-type': 'application/json' }
        : {
            'Content-Type': 'multipart/form-data',
          };
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/${type}`,
      data,
      headers,
      // headers: {
      //   'content-type': 'application/json',
      // },
    });

    if (res.data.status === 'success') {
      if (type === 'users/signup') {
        setCookieAndGetActivationPage(res.data.data.email);
      } else {
        showAlert('bg-lime-400', 'Added');
        window.setTimeout(() => {
          location.reload();
        }, 200);
      }
    }
  } catch (err) {
    showAlert('bg-red-300', err.response.data.message);
  }
};
