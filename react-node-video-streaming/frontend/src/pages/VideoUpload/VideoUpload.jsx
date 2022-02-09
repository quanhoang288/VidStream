import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Grid,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CheckIcon from '@material-ui/icons/CheckCircle';
import './VideoUpload.css';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { videoApi } from '../../apis';
import Main from '../../containers/Main/Main';
import Toast from '../../components/Toast/Toast';
import ConfirmDialog from '../../components/Modal/ConfirmDialog';
import { errorMessages } from '../../constants/messages';
// import ROUTES from '../../constants/route';

function VideoUpload() {
  const { t } = useTranslation(['upload']);

  const videoRestrictions = [
    {
      value: 'public',
      label: t('RESTRICTION_PUBLIC', { ns: 'upload' }),
    },
    {
      value: 'private',
      label: t('RESTRICTION_PRIVATE', { ns: 'upload' }),
    },
  ];

  const allowedMimeType = ['video/mp4', 'video/webm'];

  const user = useSelector((state) => state.auth.user);

  // const [isUploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState('');
  const [restriction, setRestriction] = useState(videoRestrictions[0].value);
  const [errMsg, setErrMsg] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [isUploadFinished, setUploadFinished] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);

  const history = useHistory();

  nprogress.configure({ parent: '.grid__container' });

  useEffect(() => {
    if (isUploading) {
      if (!nprogress.isStarted()) {
        nprogress.start();
      }
    } else if (isUploadFinished) {
      nprogress.done();
    }
  }, [isUploading, isUploadFinished]);

  useEffect(() => {
    if (isUploadSuccess) {
      setConfirmModalVisible(true);
    }
  }, [isUploadSuccess]);

  const validateFileInput = (file) => {
    const { size } = file;
    const { type } = file;
    if (!allowedMimeType.includes(type)) {
      return {
        statusCode: false,
        message: errorMessages.INVALID_MIME_TYPE,
      };
    }
    if (size > 2000 * 1024 * 1024) {
      return {
        isValid: false,
        message: errorMessages.INVALID_FILE_SIZE,
      };
    }

    return {
      isValid: true,
    };
  };

  const resetInputs = () => {
    setVideoFile(null);
    setDescription('');
    setRestriction(videoRestrictions[0].value);
    setConfirmModalVisible(false);
  };

  const handleFileInput = async (e) => {
    const fileInput = e.target.files[0];
    const validateResult = validateFileInput(fileInput);
    if (!validateResult.isValid) {
      setErrMsg(validateResult.message);
      setVideoFile(null);
    } else {
      setVideoFile(fileInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    const uploadData = {
      videoFile,
      description,
      restriction,
      userId: user.id,
    };

    try {
      await videoApi.upload(uploadData);
      setUploadSuccess(true);
    } catch (err) {
      console.log(err);
      setUploadSuccess(false);
      setErrMsg(errorMessages.UPLOAD_VIDEO_FAILURE);
    }
    setUploadFinished(true);
    setUploading(false);
  };

  const handleViewProfile = () => {
    history.push(`/profile/${user.id}`);
  };

  return (
    <Main>
      {errMsg && (
        <Toast
          variant="error"
          message={errMsg}
          handleClose={() => setErrMsg(null)}
        />
      )}
      {isConfirmModalVisible && (
        <ConfirmDialog
          cancelTitle="Tiếp tục chỉnh sửa"
          confirmTitle="Hủy bỏ"
          isModalVisible
          description="Video và tất cả chỉnh sửa sẽ bị hủy bỏ."
          title="Hủy bỏ bài đăng này?"
          handleCancel={() => setConfirmModalVisible(false)}
          handleConfirm={resetInputs}
        />
      )}
      {isUploadFinished && isUploadSuccess && isConfirmModalVisible && (
        <ConfirmDialog
          cancelTitle="Xem trang cá nhân"
          confirmTitle="Tải video khác lên"
          isModalVisible
          title="Video của bạn đã được đăng tải thành công!"
          handleCancel={handleViewProfile}
          handleConfirm={resetInputs}
        />
      )}
      <div className="grid__wrapper">
        <div className="grid__container">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className="video__upload__title">
                <Typography variant="h4">
                  {t('UPLOAD_TITLE', { ns: 'upload' })}
                </Typography>
                <Typography variant="h5">
                  {t('UPLOAD_SUBTITLE', { ns: 'upload' })}
                </Typography>
              </div>
            </Grid>

            <Grid container className="video__upload__content">
              <Grid item xs={3} className="video__select__grid">
                <div className="video__upload__select">
                  {videoFile ? (
                    <div className="video__name">
                      <CheckIcon fontSize="large" htmlColor="green" />
                      <Typography>{videoFile.name}</Typography>
                    </div>
                  ) : (
                    <div className="video__upload__instruction">
                      <CloudUploadIcon fontSize="large" />
                      <Typography variant="h6">
                        {t('UPLOAD_SECTION_TITLE', { ns: 'upload' })}
                      </Typography>
                      <Typography className="video__upload__mimetype">
                        {t('VIDEO_FORMAT', { ns: 'upload' })}
                      </Typography>
                      <Typography className="video__upload__duration">
                        {t('VIDEO_DURATION', { ns: 'upload' })}
                      </Typography>
                      <Typography className="video__upload__size">
                        {t('VIDEO_SIZE', { ns: 'upload' })}
                      </Typography>
                    </div>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    component="label"
                  >
                    <Typography>
                      {videoFile
                        ? t('VIDEO_SELECT_ANOTHER_BUTTON', { ns: 'upload' })
                        : t('VIDEO_SELECT_BUTTON', { ns: 'upload' })}
                    </Typography>
                    <input
                      type="file"
                      name="video"
                      onChange={handleFileInput}
                      hidden
                    />
                  </Button>
                </div>
              </Grid>

              <Grid item xs={1} />

              <Grid item xs={8}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label={t('DESCRIPTION', { ns: 'upload' })}
                    margin="normal"
                    fullWidth
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                      className: 'form__input__label',
                    }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="video__description"
                  />
                  <FormControl fullWidth>
                    <InputLabel
                      htmlFor="restrict-options"
                      className="form__input__label"
                    >
                      {t('RESTRICTION_TITLE', { ns: 'upload' })}
                    </InputLabel>
                    <Select
                      native
                      inputProps={{
                        name: 'restrict-options',
                        id: 'restrict-options',
                      }}
                      className="video__restriction"
                      value={restriction}
                      onChange={(e) => setRestriction(e.target.value)}
                    >
                      {videoRestrictions.map((res) => (
                        <option key={res.value} value={res.value}>
                          {res.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <div className="upload__button__group">
                    <Button
                      variant="contained"
                      color="default"
                      id="cancel__btn"
                      onClick={() => setConfirmModalVisible(true)}
                    >
                      {t('CANCEL_BUTTON', { ns: 'upload' })}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={videoFile === null}
                      onClick={handleSubmit}
                    >
                      {t('UPLOAD_BUTTON', { ns: 'upload' })}
                    </Button>
                  </div>
                </form>
              </Grid>
              {/* <Grid item xs={1}/> */}
            </Grid>
          </Grid>
        </div>
      </div>
    </Main>
  );
}

export default VideoUpload;
