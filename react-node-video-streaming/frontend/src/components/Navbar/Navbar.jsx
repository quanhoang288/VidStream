import React from 'react';

import {
  AppBar,
  Toolbar,
  Grid,
  Button,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showModal } from '../../redux/actions/modalActions';
import route from '../../constants/route';
import LanguagePopover from '../../containers/Menus/LanguagePopover';
import NotificationPopover from '../../containers/Menus/NotificationPopover';
import AccountPopover from '../../containers/Menus/AccountPopover';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation(['auth']);

  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Grid container style={{ alignItems: 'center' }}>
            <Grid item xs={1} />
            <Grid item xs={1}>
              <Link to="/">
                <Typography className="app__title" variant="h5" noWrap>
                  VidStream
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={4}>
              <SearchBar />
            </Grid>
            <Grid item xs={2} />
            <Grid item>
              <div className="icon__group">
                {user ? (
                  <>
                    <LanguagePopover />
                    <IconButton
                      color="inherit"
                      onClick={() => history.push(route.VIDEO_UPLOAD)}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                    <NotificationPopover />
                    <AccountPopover />
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    onClick={() => dispatch(showModal())}
                  >
                    {t('LOGIN_BUTTON', { ns: 'auth' })}
                  </Button>
                )}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* {renderMenu} */}
    </div>
  );
}
