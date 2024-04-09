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
