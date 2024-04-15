import axios from 'axios';
import { showAlert } from './alerts';

export const deleteReccords = async (endpoint, reccordsToDelete) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/${endpoint}`,
      data: {
        reccordsToDelete,
      },
      headers: {
        'content-type': 'application/json',
      },
    });

    if (res.data.status === 'success') {
      showAlert('green', 'Reccords are removed');
      window.setTimeout(() => {
        location.reload();
      }, 200);
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};
