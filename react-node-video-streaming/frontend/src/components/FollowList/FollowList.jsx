import React from 'react';
import { Button } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

  const history = useHistory();

  const authUser = useSelector((state) => state.auth.user);

  return (
    <Modal title={title} isModalVisible={true} handleClose={handleClose}>
      <div className="follow__list__container">
        {users.map((user) => (
          <div className="user__item" style={{ display: 'flex' }}>
            <img
              src={`${ASSET_BASE_URL}/${user.avatar.fileName}`}
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
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default FollowList;
