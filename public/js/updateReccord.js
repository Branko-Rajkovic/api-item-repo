import axios from 'axios';
import { showAlert } from './alerts';

export const updateReccord = async (endpoint, data, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/${endpoint}/${id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('green', 'Reccord updated');
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('red', err.response.data.message);
  }
};
