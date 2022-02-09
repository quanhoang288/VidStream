import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  List,
  Avatar,
  IconButton,
  // Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItem,
  Typography,
  ListItemIcon,
} from '@material-ui/core';
import { InView } from 'react-intersection-observer';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PulseLoader from 'react-spinners/PulseLoader';
import { useDispatch, useSelector } from 'react-redux';
import MenuPopover from '../../components/MenuPopover/MenuPopover';
import { ASSET_BASE_URL } from '../../configs';
import { notificationApi } from '../../apis';

import {
  markAllUnreadNotifications,
  saveNotificationList,
} from '../../redux/actions/notficationActions';
import { convertToDateDistance } from '../../utils/date';

function NotificationItem({ notification }) {
  const history = useHistory();

  switch (notification.type) {
    case 'LIKE_VIDEO':
      return (
        <ListItem
          className="notification__item"
          button
          selected={notification.readAt === undefined}
          key={notification._id}
          onClick={() => history.push(`/videos/${notification.video._id}`)}
        >
          <ListItemAvatar>
            <Avatar
              src={
                notification.from.avatar
                  ? `${ASSET_BASE_URL}/${notification.from.avatar.fileName}`
                  : `${ASSET_BASE_URL}/no_avatar.jpg`
              }
            />
          </ListItemAvatar>
          <ListItemText
            primary={notification.content}
            secondary={convertToDateDistance(notification.createdAt)}
            style={{ paddingRight: 20 }}
          />
          <ListItemIcon>
            <img
              src={`${ASSET_BASE_URL}/${notification.video.thumbnail.fileName}`}
              alt="Thumbnail"
              width={80}
              height={80}
            />
          </ListItemIcon>
        </ListItem>
      );

    case 'LIKE_COMMENT':
      return null;

    case 'COMMENT':
      return (
        <ListItem
          button
          selected={notification.readAt === undefined}
          key={notification._id}
          onClick={() => history.push(`/videos/${notification.video._id}`)}
        >
          <ListItemAvatar>
            <Avatar
              src={
                notification.from.avatar
                  ? `${ASSET_BASE_URL}/${notification.from.avatar.fileName}`
                  : `${ASSET_BASE_URL}/no_avatar.jpg`
              }
            />
          </ListItemAvatar>
          <ListItemText
            primary={notification.content}
            secondary={convertToDateDistance(notification.createdAt)}
            style={{ paddingRight: 20 }}
          />
          <ListItemIcon>
            <img
              src={`${ASSET_BASE_URL}/${notification.video.thumbnail.fileName}`}
              alt="Thumbnail"
              width={80}
              height={80}
            />
          </ListItemIcon>
        </ListItem>
      );
    case 'FOLLOW':
      return (
        <ListItem
          button
          selected={notification.readAt === undefined}
          key={notification._id}
          onClick={() => history.push(`/profile/${notification.from._id}`)}
        >
          <ListItemAvatar>
            <Avatar
              src={
                notification.from.avatar
                  ? `${ASSET_BASE_URL}/${notification.from.avatar.fileName}`
                  : `${ASSET_BASE_URL}/no_avatar.jpg`
              }
            />
          </ListItemAvatar>
          <ListItemText
            primary={notification.content}
            secondary={convertToDateDistance(notification.createdAt)}
          />
        </ListItem>
      );

    default:
      return null;
  }
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [shouldLoadMore, setLoadMore] = useState(false);
  const [lastNotificationId, setLastNotificationId] = useState(null);

  const { t } = useTranslation(['notification']);

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const notifications = useSelector((state) =>
    state.notification.notifications.map((notification) => {
      switch (notification.type) {
        case 'LIKE_VIDEO':
          return {
            ...notification,
            content: t('NOTIFICATION_LIKE_VIDEO', {
              ns: 'notification',
              username: notification.from.username,
            }),
          };

        case 'LIKE_COMMENT':
          return notification;

        case 'COMMENT':
          return {
            ...notification,
            content: t('NOTIFICATION_COMMENT', {
              ns: 'notification',
              username: notification.from.username,
            }),
          };

        case 'FOLLOW':
          return {
            ...notification,
            content: t('NOTIFICATION_FOLLOW', {
              ns: 'notification',
              username: notification.from.username,
            }),
          };

        default:
          return notification;
      }
    }),
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadMore = useCallback(
    async (user, lastId) => {
      try {
        const result = await notificationApi.getNotifications(
          user.id,
          lastId,
          user.token,
        );
        if (result.data.notifications) {
          dispatch(
            saveNotificationList(
              notifications.concat(result.data.notifications),
            ),
          );
        }
        setLoadMore(false);
      } catch (error) {
        console.log(error);
      }
    },
    [notifications],
  );

  useEffect(() => {
    if (open) {
      dispatch(markAllUnreadNotifications(null, authUser.token));
    }
  }, [open, authUser]);

  useEffect(() => {
    if (notifications.length > 0) {
      const lastNotification = notifications[notifications.length - 1];
      setLastNotificationId(lastNotification._id);
    }
  }, [notifications]);

  useEffect(() => {
    if (shouldLoadMore) {
      handleLoadMore(authUser, lastNotificationId);
    }
  }, [shouldLoadMore, lastNotificationId, authUser]);

  return (
    <>
      <IconButton ref={anchorRef} size="large" onClick={handleOpen}>
        {notifications.filter((noti) => noti.readAt === undefined).length >
        0 ? (
          <Badge
            badgeContent={
              notifications.filter((noti) => noti.readAt === undefined).length
            }
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        )}
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
      >
        <List
          disablePadding
          subheader={<ListSubheader disableSticky>Notification</ListSubheader>}
          style={{ maxHeight: '60vh', overflow: 'auto' }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 20px',
              }}
            >
              <Typography variant="body1">
                {t('NO_NOTIFICATIONS', { ns: 'notification' })}
              </Typography>
            </div>
          ) : (
            notifications.map((notification, index) =>
              index === notifications.length - 1 ? (
                <InView
                  threshold={1}
                  onChange={(inView) => {
                    if (inView) {
                      setLoadMore(true);
                    }
                  }}
                >
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                </InView>
              ) : (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ),
            )
          )}
          <div style={{ textAlign: 'center' }}>
            <PulseLoader loading={shouldLoadMore} size={8} />
          </div>
        </List>
      </MenuPopover>
    </>
  );
}
