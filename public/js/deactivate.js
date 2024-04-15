import axios from 'axios';
import { showAlert } from './alerts';

export const deactivateReviews = async (reviewsToDeactivate) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/reviews',
      data: {
        reviewsToDeactivate,
      },
    });

    if (res.data.status === 'success') {
      showAlert('green', 'reviews are deactivated');
      window.setTimeout(() => {
        location.assign('/manage-reviews');
      }, 1000);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};

export const addReview = async (data) => {
  try {
    // for (const value of data.values()) {
    //   console.log(value);
    // }
    // for (const key of data.keys()) {
    //   console.log(key);
    // }
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
