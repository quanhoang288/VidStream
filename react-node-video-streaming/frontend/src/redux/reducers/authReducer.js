import { authActionTypes } from '../actions/authActions';

const initialState = {
  isLoggingIn: false,
  isRegistering: false,
  registerSuccess: false,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authActionTypes.LOGIN_REQUEST:
      return {
        ...initialState,
        isLoggingIn: true,
      };

    case authActionTypes.LOGIN_SUCCESS:
      return {
        ...initialState,
        user: action.payload,
      };

    case authActionTypes.LOGIN_FAILURE:
      return {
        ...initialState,
        error: action.payload,
      };

    case authActionTypes.REGISTER_REQUEST:
      return {
        ...initialState,
        isRegistering: true,
      };

    case authActionTypes.REGISTER_SUCCESS:
      return {
        ...initialState,
        registerSuccess: true,
        user: action.payload,
      };

    case authActionTypes.REGISTER_FAILURE:
      return {
        ...initialState,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
