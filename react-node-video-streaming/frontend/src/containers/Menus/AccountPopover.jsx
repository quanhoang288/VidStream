import React, { useRef, useState } from 'react';
// material
// import { alpha } from '@material-ui/core/styles';
import {
  Avatar,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined'; // components
import MenuPopover from '../../components/MenuPopover/MenuPopover';
import { logout } from '../../redux/actions/authActions';
import { ASSET_BASE_URL } from '../../configs';

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen}>
        <Avatar
          src={
            user.avatar
              ? `${ASSET_BASE_URL}/${user.avatar.fileName}`
              : `${ASSET_BASE_URL}/no_avatar.jpg`
          }
          style={{ width: 30, height: 30 }}
        />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
      >
        <MenuItem onClick={() => history.push(`/profile/${user.id}`)}>
          <ListItemIcon style={{ width: 36, minWidth: 30 }}>
            <PersonOutlinedIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
            Xem hồ sơ
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(logout());
            handleClose();
          }}
        >
          <ListItemIcon style={{ width: 36, minWidth: 30 }}>
            <ExitToAppOutlinedIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
            Đăng xuất
          </ListItemText>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
