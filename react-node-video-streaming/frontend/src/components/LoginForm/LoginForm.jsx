import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import Layout from '../../containers/Layout/Layout';
import { LOGIN_MODAL } from '../../constants';
import './LoginForm.css';

function LoginForm(props) {
  const {
    credentials,
    handleRegisterClick,
    handleSubmit,
    handleTextChange,
    submitButtonDisabled,
  } = props;
  const isLoggingIn = useSelector((state) => state.auth.isLoggingIn);

  return (
    <Layout>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          fullWidth
          id="username"
          label="Tài khoản"
          name="username"
          value={credentials.username}
          onChange={(e) =>
            handleTextChange(LOGIN_MODAL, e.target.name, e.target.value)
          }
          autoFocus
        />
        <TextField
          margin="normal"
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          id="password"
          value={credentials.password}
          onChange={(e) =>
            handleTextChange(LOGIN_MODAL, e.target.name, e.target.value)
          }
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          className="submit__btn"
          variant="contained"
          color="secondary"
          sx={{ mt: 3, mb: 2 }}
          disabled={submitButtonDisabled}
        >
          {isLoggingIn && <CircularProgress />}
          {!isLoggingIn && 'Đăng nhập'}
        </Button>
        <div className="text__center">
          <Link href="#" variant="body2" onClick={handleRegisterClick}>
            Chưa có tài khoản? Đăng ký
          </Link>
        </div>
      </Box>
    </Layout>
  );
}

export default LoginForm;
