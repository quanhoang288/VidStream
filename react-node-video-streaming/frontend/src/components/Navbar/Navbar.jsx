import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Grid, Paper } from '@material-ui/core';
import './Navbar.css';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

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

  return (
    <div>
      <AppBar position="sticky" color="transparent">
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
                <IconButton color="inherit">
                  <CloudUploadIcon />
                </IconButton>
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
