import React from 'react';
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
import './VideoUpload.css';
import { videoApi } from '../../apis';
import Main from '../../containers/Main/Main';

function VideoUpload() {
  const videoRestrictions = [
    {
      value: 'public',
      label: 'Công khai',
    },
    {
      value: 'friends',
      label: 'Bạn bè',
    },
    {
      value: 'private',
      label: 'Riêng tư',
    },
  ];

  const handleFileInput = async (e) => {
    const video = e.target.files[0];

    try {
      const uploadResult = await videoApi.uploadFile(video);
      console.log(uploadResult.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submiting');
  };

  return (
    <Main>
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
                  <div className="video__upload__instruction">
                    <CloudUploadIcon fontSize="large" />
                    <Typography variant="h6">Chọn video để tải lên</Typography>
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
                  <Button
                    variant="contained"
                    color="secondary"
                    component="label"
                  >
                    <Typography>Chọn tập tin</Typography>
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
                    >
                      Hủy
                    </Button>
                    <Button variant="contained" color="secondary">
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
