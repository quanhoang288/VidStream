import React from 'react';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ASSET_BASE_URL } from '../../configs';
import './Sidebar.css';

function Sidebar(props) {
  const {
    suggestedAccounts,
    selectedVideoOption,
    videoListOptions,
    onSelectVideoOption,
  } = props;

  const { t } = useTranslation();

  const history = useHistory();

  return (
    <div className="sidebar__overlay">
      <div className="sidebar__container">
        <div className="video__categories">
          <Typography variant="h6">{t('DISCOVER_CONTENT')}</Typography>
          <List>
            {videoListOptions.map((option) => (
              <ListItem
                button
                selected={selectedVideoOption === option.value}
                key={option.value}
                className="category__item"
                onClick={() => onSelectVideoOption(option.value)}
              >
                <ListItemIcon>
                  {option.value === 'suggestion' ? (
                    <HomeIcon fontSize="large" />
                  ) : (
                    <PeopleIcon fontSize="large" />
                  )}
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </List>
        </div>
        <Divider />
        <div className="suggested__accs mt__1">
          <Typography variant="h6">{t('SUGGESTED_ACCOUNTS')}</Typography>
          <List>
            {suggestedAccounts &&
              suggestedAccounts.map((acc) => (
                <ListItem
                  button
                  key={acc._id}
                  className="category__item"
                  onClick={() => history.push(`/profile/${acc._id}`)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={acc.username}
                      src={
                        acc.avatar
                          ? `${ASSET_BASE_URL}/${acc.avatar.fileName}`
                          : `${ASSET_BASE_URL}/no_avatar.jpg`
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText primary={acc.username} />
                </ListItem>
              ))}
          </List>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
