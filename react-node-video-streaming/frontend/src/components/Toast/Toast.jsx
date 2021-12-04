import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

import React, { useState } from 'react';

function Toast(props) {
  const { variant, message, ...rest } = props;
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={handleClose}
      {...rest}
    >
      <Alert severity={variant} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
