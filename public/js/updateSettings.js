// UPDATEDATA
import axios from 'axios';
import { showAlert } from './alerts';

const SERVER_URL = process.env.SERVER_URL || 'http://127.0.0.1:3000';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `${SERVER_URL}/api/v1/users/updateMyPasswor`
        : `${SERVER_URL}/api/v1/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
