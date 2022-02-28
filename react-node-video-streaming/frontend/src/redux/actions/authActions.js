export const authActionTypes = {
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_INFO: 'UPDATE_INFO',
};

const updateAuthInfo = (newInfo) => ({
  type: authActionTypes.UPDATE_INFO,
  payload: newInfo,
});

const registerRequest = () => ({
  type: authActionTypes.REGISTER_REQUEST,
});

const registerSuccess = (user) => ({
  type: authActionTypes.REGISTER_SUCCESS,
  payload: user,
});

const registerFailure = (error) => ({
  type: authActionTypes.REGISTER_FAILURE,
  payload: error,
});

const loginRequest = () => ({
  type: authActionTypes.LOGIN_REQUEST,
});

const loginSuccess = (user) => ({
  type: authActionTypes.LOGIN_SUCCESS,
  payload: user,
});

const loginFailure = (error) => ({
  type: authActionTypes.LOGIN_FAILURE,
  payload: error,
});

const logout = () => ({
  type: authActionTypes.LOGOUT,
});

export {
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
  registerRequest,
  registerFailure,
  registerSuccess,
  updateAuthInfo,
};
