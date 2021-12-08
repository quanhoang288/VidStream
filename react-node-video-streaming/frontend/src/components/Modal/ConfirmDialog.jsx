import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  Typography,
} from '@material-ui/core';
import './ConfirmDialog.css';

function ConfirmDialog(props) {
  const {
    cancelTitle,
    confirmTitle,
    isModalVisible,
    handleCancel,
    handleConfirm,
    description,
    title,
  } = props;
  return (
    <Dialog open={isModalVisible} aria-labelledby="confirm-dialog-title">
      <DialogContent className="dialog__content">
        <div className="dialog__text">
          <Typography variant="h5">{title}</Typography>
          {description && <Typography>{description}</Typography>}
        </div>
        <Divider />
        <div className="confirm__button_group">
          <Button fullWidth onClick={handleConfirm} color="secondary">
            {confirmTitle}
          </Button>
          <Divider />
          <Button fullWidth onClick={handleCancel}>
            {cancelTitle}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
