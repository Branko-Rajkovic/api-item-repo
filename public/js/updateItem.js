import axios from 'axios';
import { showAlert } from './alerts';

export const updateItem = async (data, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/items/${id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('green', 'Item updated');
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('red', err.response.data.message);
  }
};

// export const deleteItem = async (id) => {
//   try {
//     const res = await axios({
//       method: 'DELETE',
//       url: `http://127.0.0.1:3000/api/v1/items/${id}`,
//     });

//     if (res.data.status === 'success') {
//       showAlert('green', 'Item is removed');
//     }
//   } catch (err) {
//     showAlert('red', err.response.data.message);
//   }
// };
