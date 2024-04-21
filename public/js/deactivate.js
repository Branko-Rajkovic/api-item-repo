import axios from 'axios';
import { showAlert } from './alerts';

export const deacctivateReccords = async (endpoint, reccordsToDeacctivate) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/${endpoint}/deacctivate`,
      data: {
        reccordsToDeacctivate,
      },
    });

    if (res.data.status === 'success') {
      showAlert('green', 'reccords are deactivated');
      window.setTimeout(() => {
        location.reload();
      }, 200);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};

export const acctivateReccords = async (endpoint, reccordsToAcctivate) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/${endpoint}/acctivate`,
      data: {
        reccordsToAcctivate,
      },
    });

    if (res.data.status === 'success') {
      showAlert('green', 'reccords are acctivated');
      window.setTimeout(() => {
        location.reload();
      }, 200);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};

export const addReview = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/reviews',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('green', 'review is added');
      window.setTimeout(() => {
        location.assign(`${data.aboutItem}`);
      }, 200);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};
