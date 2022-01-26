import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  List,
  MenuItem,
  ListItemText,
  Box,
  TextField,
  Button,
} from '@material-ui/core';
import './EditProfile.css';
import { useSelector } from 'react-redux';
import Main from '../../containers/Main/Main';
import Toast from '../../components/Toast/Toast';
import { userApi } from '../../apis';
import { ASSET_BASE_URL } from '../../configs';
import ConfirmDialog from '../../components/Modal/ConfirmDialog';

function EditProfile() {
  const allowedMimeType = ['image/jpg', 'image/jpeg', 'image/png'];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [infoData, setInfoData] = useState({
    username: '',
    name: '',
    bio: '',
    avatarUri: null,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordValidationErrors, setPasswordValidationErrors] = useState({});
  const [editSuccessMessage, setEditSuccessMessage] = useState(null);
  const [editErrorMessage, setEditErrorMessage] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  const authUser = useSelector((state) => state.auth.user);

  const avatarInputRef = useRef();

  const validatePasswordData = (inputPasswordData) => {
    let isValid = true;
    if (inputPasswordData.newPassword.length < 6) {
      setPasswordValidationErrors({
        newPassword: 'Password must contain at least 6 characters',
      });
      isValid = false;
    } else if (inputPasswordData.newPassword.length > 255) {
      setPasswordValidationErrors({
        newPassword: 'Password must not contain more than 255 characters',
      });

      isValid = false;
    } else if (
      inputPasswordData.confirmPassword !== inputPasswordData.newPassword
    ) {
      setPasswordValidationErrors({
        confirmPassword: 'Confirm password does not match new password',
      });

      isValid = false;
    } else {
      setPasswordValidationErrors({});
    }

    return isValid;
  };

  const handleEditInfo = useCallback(async () => {
    try {
      await userApi.editInfo(infoData, authUser.token);
      setEditSuccessMessage('Edit info successfully');
    } catch (error) {
      console.log(error.response);
      if (error.response) {
        setEditErrorMessage(error.response.data.message);
      } else {
        setEditErrorMessage('Error editing user info');
      }
    }
  }, [infoData, authUser]);

  const handleChangePassword = useCallback(async () => {
    if (!validatePasswordData(passwordData)) {
      return;
    }
    try {
      await userApi.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword,
        authUser.token,
      );
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setEditSuccessMessage('Update password successfully');
    } catch (error) {
      console.log(error.response);
      if (error.response && error.response.data) {
        const { errorCode, message } = error.response.data;
        if (errorCode && errorCode === 'INCORRECT_PASSWORD') {
          setPasswordValidationErrors({
            oldPassword: message,
          });
        } else if (errorCode === 'SAME_PASSWORD') {
          setPasswordValidationErrors({
            newPassword: message,
          });
        } else {
          setEditErrorMessage(error.response.data.message);
        }
      }
    }
  }, [passwordData, authUser]);

  const validateFileInput = (file) => {
    const { type } = file;
    if (!allowedMimeType.includes(type)) {
      return {
        isValid: false,
        message: 'Invalid mime type',
      };
    }

    return {
      isValid: true,
    };
  };

  const handleChangeProfile = useCallback(
    async (e) => {
      const fileInput = e.target.files[0];
      const validateResult = validateFileInput(fileInput);
      if (!validateResult.isValid) {
        setEditErrorMessage(validateResult.message);
      } else {
        try {
          const updateResult = await userApi.changeProfile(
            fileInput,
            authUser.token,
          );
          setInfoData({
            ...infoData,
            avatarUri: updateResult.data.avatar.fileName,
          });
          if (isConfirmModalVisible) {
            setConfirmModalVisible(false);
          }
          setEditSuccessMessage('Update profile image successfully');
        } catch (error) {
          console.log(error);
        }
      }
    },
    [authUser, infoData, isConfirmModalVisible],
  );

  const fetchUserInfo = async (userId) => {
    const result = await userApi.getInfo(userId);
    const userInfo = result.data.user;
    setInfoData({
      username: userInfo.username,
      bio: userInfo.bio || '',
      name: userInfo.name || '',
      avatarUri: userInfo.avatar ? userInfo.avatar.fileName : null,
    });
  };

  useEffect(() => {
    if (authUser) {
      fetchUserInfo(authUser.id);
    }
  }, [authUser]);

  return (
    <Main>
      {editSuccessMessage && (
        <Toast
          variant="success"
          message={editSuccessMessage}
          handleClose={() => setEditSuccessMessage(null)}
        />
      )}
      {editErrorMessage && (
        <Toast
          variant="error"
          message={editErrorMessage}
          handleClose={() => setEditErrorMessage(null)}
        />
      )}
      {isConfirmModalVisible && (
        <ConfirmDialog
          cancelTitle="Remove Current Photo"
          confirmTitle="Upload Photo"
          isModalVisible
          title="Change Profile Photo"
          handleCancel={() => setConfirmModalVisible(false)}
          handleConfirm={() => avatarInputRef.current.click()}
        />
      )}
      <div className="edit__background">
        <div className="edit__profile__container">
          <div className="edit__options__container">
            <List>
              {['Edit Profile', 'Change password'].map((text, index) => (
                <MenuItem
                  button
                  key={text}
                  className="sidebar__item"
                  selected={selectedIndex === index}
                >
                  <ListItemText
                    primary={text}
                    onClick={() => setSelectedIndex(index)}
                  />
                </MenuItem>
              ))}
            </List>
          </div>
          <div className="main__content">
            {selectedIndex === 0 ? (
              <>
                <div className="edit__avatar__container">
                  <label
                    role="button"
                    title="Add a profile photo"
                    className="user__avatar__btn"
                    htmlFor="avatar"
                  >
                    <span>
                      <img
                        src={`${ASSET_BASE_URL}/${infoData.avatarUri}`}
                        alt="Avatar"
                        width={50}
                        height={50}
                        className="user__avatar"
                      />
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        ref={avatarInputRef}
                        hidden
                        onChange={(e) => handleChangeProfile(e)}
                      />
                    </span>
                  </label>

                  <div className="username__container">
                    <h1>{infoData.username}</h1>
                    <button
                      type="button"
                      onClick={() => setConfirmModalVisible(true)}
                    >
                      Change profile photo
                    </button>
                  </div>
                </div>
                <div className="edit__info__form">
                  <Box component="form" noValidate>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      value={infoData.name}
                      onChange={(e) =>
                        setInfoData({ ...infoData, name: e.target.value })
                      }
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      value={infoData.username}
                      onChange={(e) =>
                        setInfoData({ ...infoData, username: e.target.value })
                      }
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      id="bio"
                      label="Bio"
                      name="bio"
                      value={infoData.bio}
                      onChange={(e) =>
                        setInfoData({ ...infoData, bio: e.target.value })
                      }
                    />
                    <div className="submit__btn__container">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditInfo}
                        disabled={infoData.username === ''}
                      >
                        Submit
                      </Button>
                    </div>
                  </Box>
                </div>
              </>
            ) : (
              <div className="edit__password__form">
                <Box component="form" noValidate>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="old_password"
                    type="password"
                    label="Old password"
                    name="old_password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    error={passwordValidationErrors.oldPassword !== undefined}
                    helperText={passwordValidationErrors.oldPassword}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="new_password"
                    type="password"
                    label="New password"
                    name="new_password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    error={passwordValidationErrors.newPassword !== undefined}
                    helperText={passwordValidationErrors.newPassword}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="confirm_new_password"
                    type="password"
                    label="Confirm new password"
                    name="confirm_new_password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    error={
                      passwordValidationErrors.confirmPassword !== undefined
                    }
                    helperText={passwordValidationErrors.confirmPassword}
                  />
                  <div className="submit__btn__container">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleChangePassword}
                      disabled={
                        passwordData.oldPassword === '' ||
                        passwordData.newPassword === '' ||
                        passwordData.confirmPassword === ''
                      }
                    >
                      Submit
                    </Button>
                  </div>
                </Box>
              </div>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}

export default EditProfile;
