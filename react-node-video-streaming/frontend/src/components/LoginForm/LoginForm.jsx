import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation(['auth']);

  return (
    <Layout>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          fullWidth
          id="username"
          label={t('USERNAME', { ns: 'auth' })}
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
          label={t('PASSWORD', { ns: 'auth' })}
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
          {isLoggingIn && <CircularProgress size={20} color="inherit" />}
          {!isLoggingIn && t('LOGIN_BUTTON', { ns: 'auth' })}
        </Button>
        <div className="text__center">
          <Link href="#" variant="body2" onClick={handleRegisterClick}>
            {t('NOT_REGISTER_LINK', { ns: 'auth' })}
          </Link>
        </div>
      </Box>
    </Layout>
  );
}

export default LoginForm;
