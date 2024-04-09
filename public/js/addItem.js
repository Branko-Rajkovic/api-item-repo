import axios from 'axios';
import { showAlert } from './alerts';

export const addItem = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/items',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('bg-lime-400', 'Item created');
    }
  } catch (err) {
    showAlert('bg-red-300', err.response.data.message);
  }
};

export const removeItems = async (itemsToDelete) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/items/`,
      data: {
        itemsToDelete,
      },
    });

    if (res.data.status === 'success') {
      showAlert('green', 'Item is removed');
    }
  } catch (err) {
    showAlert('red', err.response.data.message);
  }
};
