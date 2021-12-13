import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

import React, { useState } from 'react';

function Toast(props) {
  const { variant, message, handleClose, ...rest } = props;
  const [open, setOpen] = useState(true);
  const onClose = () => {
    setOpen(false);
    if (handleClose) {
      handleClose();
    }
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={onClose}
      {...rest}
    >
      <Alert severity={variant} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
