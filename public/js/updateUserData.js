import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users//update-my-password'
        : '/api/v1/users/update-me';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('bg-lime-500', 'Your data are updated!');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1500);
    }
  } catch (err) {
    showAlert('bg-red-500', res.data.message);
  }
};
