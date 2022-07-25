import axios from 'axios';
import { showAlert } from './alerts';
import { hideSpinner, showSpinner } from './utils';

export const login = async (email, password) => {
  // console.log('LOGIN');
  // console.log(email, password);
  try {
    console.log('LOGIN');
    showSpinner();
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    hideSpinner();

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    hideSpinner();
    showAlert('error', err.response.data.message);
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  // console.log('LOGIN');
  // console.log(email, password);
  try {
    showSpinner();
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    hideSpinner();

    if (res.data.status === 'success') {
      showAlert('success', 'signUp in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    hideSpinner();
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') window.location.replace('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
