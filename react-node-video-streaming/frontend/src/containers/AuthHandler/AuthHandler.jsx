import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal/Modal';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { LOGIN_MODAL, REGISTER_MODAL } from '../../constants';
import { hideModal } from '../../redux/actions/modalActions';
import { authActions } from '../../redux/actions';
import { authApi } from '../../apis';
import { loginSuccess, registerSuccess } from '../../redux/actions/authActions';
import { errorMessages } from '../../constants/messages';

function AuthHandler() {
  const [curModal, setCurModal] = useState(LOGIN_MODAL);
  const [registerInfo, setRegisterInfo] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerFailedBefore, setRegisterFailedBefore] = useState(false);

  const isModalVisible = useSelector((state) => state.modal.isModalVisible);
  const authenticatedUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const isValidCredentials = () => {
    const { username, password } = credentials;
    return (
      username !== '' &&
      password !== '' &&
      password.length > 5 &&
      password.length < 256
    );
  };

  const validateRegisterInfo = () => {
    const { username, password, confirmPassword } = registerInfo;
    const errors = {};
    let isValid = true;
    if (username === '') {
      isValid = false;
      errors.username = errorMessages.USERNAME_REQUIRED;
    }

    if (password === '') {
      isValid = false;
      errors.password = errorMessages.PASSWORD_REQUIRED;
    } else if (password.length < 6 || password.length > 255) {
      isValid = false;
      errors.password = errorMessages.PASSWORD_LENGTH_INVALID;
    }

    if (confirmPassword === '') {
      isValid = false;
      errors.confirmPassword = errorMessages.CONFIRM_PASSWORD_REQUIRED;
    } else if (confirmPassword !== password) {
      isValid = false;
      errors.confirmPassword = errorMessages.CONFIRM_PASSWORD_NOT_MATCH;
    }
    setRegisterErrors({
      ...errors,
    });
    return isValid;
  };

  const resetInputAndErrorStates = () => {
    setCredentials({
      username: '',
      password: '',
    });
    setRegisterInfo({
      username: '',
      password: '',
      confirmPassword: '',
    });
    setRegisterErrors({});
    setRegisterFailedBefore(false);
  };

  const handleCloseModal = () => {
    dispatch(hideModal());
  };

  useEffect(() => {
    if (authenticatedUser) {
      handleCloseModal();
    }
  }, [authenticatedUser]);

  useEffect(() => {
    if (isModalVisible) {
      setCurModal(LOGIN_MODAL);
      resetInputAndErrorStates();
    }
  }, [isModalVisible]);

  useEffect(() => {
    setLoginButtonDisabled(!isValidCredentials());
  }, [credentials]);

  useEffect(() => {
    if (registerFailedBefore) {
      validateRegisterInfo();
    }
  }, [registerInfo]);

  const handleTextChange = (modalType, name, val) => {
    if (modalType === LOGIN_MODAL) {
      setCredentials({
        ...credentials,
        [name]: val,
      });
    } else {
      setRegisterInfo({
        ...registerInfo,
        [name]: val,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(authActions.loginRequest());
    try {
      const loginResult = await authApi.login(credentials);
      const { data } = loginResult;
      const user = {
        ...data.user,
        token: data.token,
      };
      dispatch(loginSuccess(user));
    } catch (err) {
      const res = err.response;
      let errMsg;
      if (res && res.status === 400) {
        errMsg = errorMessages.INCORRECT_USERNAME_OR_PASSWORD;
      } else {
        errMsg = errorMessages.INTERNAL_SERVER_ERROR;
      }
      dispatch(authActions.loginFailure(errMsg));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const isValidRegisterInfo = validateRegisterInfo();
    if (!isValidRegisterInfo) {
      setRegisterFailedBefore(true);
      return;
    }

    dispatch(authActions.registerRequest());
    try {
      const registerData = {
        username: registerInfo.username,
        password: registerInfo.password,
      };
      const registerResult = await authApi.register(registerData);
      const { data } = registerResult;
      const user = {
        ...data.user,
        token: data.token,
      };
      console.log(user);
      dispatch(registerSuccess(user));
    } catch (err) {
      const res = err.response;
      let errMsg;
      if (res && res.status === 400) {
        errMsg = errorMessages.USERNAME_ALREADY_EXIST;
      } else {
        errMsg = errorMessages.INTERNAL_SERVER_ERROR;
      }
      dispatch(authActions.registerFailure(errMsg));
    }
  };

  return (
    <Modal
      isModalVisible={isModalVisible}
      handleClose={handleCloseModal}
      title={curModal === LOGIN_MODAL ? 'Đăng nhập' : 'Đăng ký'}
    >
      {curModal === LOGIN_MODAL ? (
        <LoginForm
          credentials={credentials}
          handleTextChange={handleTextChange}
          handleRegisterClick={() => setCurModal(REGISTER_MODAL)}
          handleSubmit={handleLogin}
          submitButtonDisabled={loginButtonDisabled}
        />
      ) : (
        <RegisterForm
          registerInfo={registerInfo}
          registerErrors={registerErrors}
          handleTextChange={handleTextChange}
          handleSubmit={handleRegister}
          handleLoginClick={() => setCurModal(LOGIN_MODAL)}
        />
      )}
    </Modal>
  );
}

export default AuthHandler;
