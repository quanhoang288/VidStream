import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Grid, Paper, Button, Link } from '@material-ui/core';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import AuthHandler from '../../containers/AuthHandler/AuthHandler';
import { showModal } from '../../redux/actions/modalActions';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const renderGuestNavbarOptions = (
    <>
      <Link href="#" variant="body1" className="mr__2 vertical__center ">
        Tải lên
      </Link>
      <Button
        variant="contained"
        color="secondary"
        size="medium"
        onClick={() => dispatch(showModal())}
      >
        Đăng nhập
      </Button>
    </>
  );

  const renderAuthenticatedNavbarOptions = (
    <>
      <IconButton color="inherit">
        <CloudUploadIcon />
      </IconButton>
      <IconButton color="inherit">
        <NotificationsIcon />
      </IconButton>
      <IconButton
        edge="end"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </>
  );

  return (
    <div>
      <AuthHandler />
      <AppBar position="fixed" color="transparent">
        <Toolbar>
          <Grid container style={{ alignItems: 'center' }}>
            <Grid item xs={1} />
            <Grid item xs={1}>
              <Typography className="app__title" variant="h5" noWrap>
                VidStream
              </Typography>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={4}>
              <Paper component="form" elevation={2} className="search__wrapper">
                <InputBase
                  style={{ marginLeft: '5px', flex: 1 }}
                  placeholder="Search"
                  inputProps={{ 'aria-label': 'search for videos' }}
                />
                <IconButton
                  type="submit"
                  className="search__icon"
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <Grid item xs={2} />
            <Grid item>
              <div className="icon__group">
                {user
                  ? renderAuthenticatedNavbarOptions
                  : renderGuestNavbarOptions}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
