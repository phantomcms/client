import { state } from '.';
import { AuthService } from '../services';

export const checkExistingAuthentication = () => {
  const token = localStorage.getItem('user-token');

  if (!token) {
    // we don't have a token in local storage
    state.authenticating = false;
    return false;
  }

  // we have a token in local storage retrieve the user it belongs to
  AuthService.authenticate().then(user => {
    state.user = user;
    state.authenticating = false;
  }, () => {
    state.authenticating = false;
    localStorage.removeItem('user-token');
  });
}

export const setAuthentication = (user: any, token: string) => {
  localStorage.setItem('user-token', token);
  state.user = user;
}