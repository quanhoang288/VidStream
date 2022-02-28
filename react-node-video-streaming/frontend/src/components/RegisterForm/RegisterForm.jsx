import React from 'react';
import { Box, Button, Link, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation(['auth']);

  return (
    <Layout>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label={t('USERNAME', { ns: 'auth' })}
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
          label={t('PASSWORD', { ns: 'auth' })}
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
          label={t('CONFIRM_PASSWORD', { ns: 'auth' })}
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
          {t('REGISTER_BUTTON', { ns: 'auth' })}
        </Button>
        <div className="text__center">
          <Link href="#" variant="body2" onClick={handleLoginClick}>
            {t('ALREADY_HAS_ACCOUNT', { ns: 'auth' })}
          </Link>
        </div>
      </Box>
    </Layout>
  );
}

export default RegisterForm;
