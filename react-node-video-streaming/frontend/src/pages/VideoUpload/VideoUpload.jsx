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
import { videoApi } from '../../apis';
import Main from '../../containers/Main/Main';
import Toast from '../../components/Toast/Toast';
import ConfirmDialog from '../../components/Modal/ConfirmDialog';
import { errorMessages } from '../../constants/messages';

function VideoUpload() {
  const videoRestrictions = [
    {
      value: 'public',
      label: 'Công khai',
    },
    {
      value: 'private',
      label: 'Riêng tư',
    },
  ];

  const allowedMimeType = ['video/mp4', 'video/webm'];

  // TODO: get authenticated user id
  const userId = '61ab7f4e551a3940d0d5069e';

  // const [isUploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState('');
  const [restriction, setRestriction] = useState(videoRestrictions[0].value);
  const [errMsg, setErrMsg] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [isUploadFinished, setUploadFinished] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);

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
      userId,
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
      {isUploadFinished && isUploadSuccess && (
        <ConfirmDialog
          cancelTitle="Xem trang cá nhân"
          confirmTitle="Tải video khác lên"
          isModalVisible
          title="Video của bạn đã được đăng tải thành công!"
          handleCancel={() => setConfirmModalVisible(false)}
          handleConfirm={resetInputs}
        />
      )}
      <div className="grid__wrapper">
        <div className="grid__container">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className="video__upload__title">
                <Typography variant="h4">Tải video lên</Typography>
                <Typography variant="h5">
                  Đăng video vào tài khoản của bạn
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
                        Chọn video để tải lên
                      </Typography>
                      <Typography className="video__upload__mimetype">
                        MP4 hoặc Webm
                      </Typography>
                      <Typography className="video__upload__duration">
                        Tối đa 5 phút
                      </Typography>
                      <Typography className="video__upload__size">
                        Nhỏ hơn 2 GB
                      </Typography>
                    </div>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    component="label"
                  >
                    <Typography>
                      {videoFile ? 'Chọn video khác' : 'Chọn video'}
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
                    label="Chú thích"
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
                      Ai có thể xem video này
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
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={videoFile === null}
                      onClick={handleSubmit}
                    >
                      Đăng
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
