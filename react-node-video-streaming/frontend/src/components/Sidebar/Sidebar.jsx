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
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar__overlay">
      <div className="sidebar__container">
        <div className="video__categories">
          <Typography variant="h6">Kham pha noi dung</Typography>
          <List>
            {['Danh cho ban', 'Dang theo doi'].map((text, index) => (
              <ListItem button key={text} className="category__item">
                <ListItemIcon>
                  {index === 0 ? (
                    <HomeIcon fontSize="large" />
                  ) : (
                    <PeopleIcon fontSize="large" />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
        <Divider />
        <div className="suggested__accs mt__1">
          <Typography variant="h6">Tai khoan duoc goi y</Typography>
          <List>
            <ListItem button key={1} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={2} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={1} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={2} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={1} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={2} className="category__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
          </List>
        </div>
        {/* <Divider />
        <div className="suggested__accs mt__1">
          <Typography variant="h6">Tai khoan dang theo doi</Typography>
          <List>
            <ListItem button key={1} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Hoang Quan" />
            </ListItem>
            <ListItem button key={2} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
            <ListItem button key={3} className="sidebar__item">
              <ListItemAvatar>
                <Avatar
                  alt="Quan Hoang"
                  src="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary="Quan Hoang" />
            </ListItem>
          </List>
        </div> */}
      </div>
    </div>
  );
}

export default Sidebar;
