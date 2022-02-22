import React from 'react';
import { Button } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Modal from '../Modal/Modal';
import './FollowList.css';
import { ASSET_BASE_URL } from '../../configs';

function FollowList(props) {
  const {
    title,
    users,
    handleClose,
    isFollowingList,
    handleToggleFollow,
    isOwnProfile,
  } = props;

  const { t } = useTranslation();

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.user);

  return (
    <Modal title={title} isModalVisible={true} handleClose={handleClose}>
      <div className="follow__list__container">
        {users.map((user) => (
          <div className="user__item" style={{ display: 'flex' }}>
            <img
              src={
                user.avatar && user.avatar.fileName
                  ? `${ASSET_BASE_URL}/${user.avatar.fileName}`
                  : `${ASSET_BASE_URL}/no_avatar.jpg`
              }
              alt="Profile"
              className="user__item__avatar"
              onClick={() => history.push(`/profile/${user._id}`)}
            />
            <Link to={`/profile/${user._id}`} className="user__item__username">
              {user.username}
            </Link>
            {((!isOwnProfile && user._id !== authUser.id) ||
              (isFollowingList && isOwnProfile)) && (
              <Button
                variant="outlined"
                color={user.isFollowing ? 'inherit' : 'secondary'}
                style={{ maxHeight: '30px' }}
                onClick={() => handleToggleFollow(user._id, user.isFollowing)}
              >
                {user.isFollowing ? t('FOLLOWING_BUTTON') : t('FOLLOW_BUTTON')}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default FollowList;
