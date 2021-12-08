import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function Modal(props) {
  const { isModalVisible, title, handleClose, children } = props;
  return (
    <Dialog
      open={isModalVisible}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      {title && (
        <DialogTitle>
          <Typography variant="h6">{title}</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 1,
              right: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
