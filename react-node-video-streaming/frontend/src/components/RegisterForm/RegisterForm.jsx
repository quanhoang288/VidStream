import React from 'react';
import { Box, Button, Link, TextField } from '@material-ui/core';
import Layout from '../../containers/Layout/Layout';
import { REGISTER_MODAL } from '../../constants';

function RegisterForm(props) {
  const {
    registerInfo,
    registerErrors,
    handleLoginClick,
    handleSubmit,
    handleTextChange,
  } = props;

  return (
    <Layout>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Tài khoản"
          name="username"
          value={registerInfo.username}
          onChange={(e) =>
            handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
          }
          error={registerErrors.username !== undefined}
          helperText={registerErrors.username}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          id="password"
          value={registerInfo.password}
          onChange={(e) =>
            handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
          }
          error={registerErrors.password !== undefined}
          helperText={registerErrors.password}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          type="password"
          id="confirm-password"
          value={registerInfo.confirmPassword}
          onChange={(e) =>
            handleTextChange(REGISTER_MODAL, e.target.name, e.target.value)
          }
          error={registerErrors.confirmPassword !== undefined}
          helperText={registerErrors.confirmPassword}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          className="submit__btn"
        >
          Đăng ký
        </Button>
        <div className="text__center">
          <Link href="#" variant="body2" onClick={handleLoginClick}>
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </Box>
    </Layout>
  );
}

export default RegisterForm;
