import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/CheckCircle';

import { useSelector } from 'react-redux';
import Modal from '../../components/Modal/Modal';
import { videoApi } from '../../apis';

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

function VideoEdit({ videoId, isModalVisible, handleClose, onSuccess }) {
  const [description, setDescription] = useState('test');
  const [restriction, setRestriction] = useState(videoRestrictions[0].value);
  const [videoFile, setVideoFile] = useState(null);
  const [isEditing, setEditing] = useState(false);

  const authUser = useSelector((state) => state.auth.user);

  const validateFileInput = (file) => {
    const { size } = file;
    const { type } = file;
    if (!allowedMimeType.includes(type)) {
      return {
        statusCode: false,
        // message: errorMessages.INVALID_MIME_TYPE,
      };
    }
    if (size > 2000 * 1024 * 1024) {
      return {
        isValid: false,
        // message: errorMessages.INVALID_FILE_SIZE,
      };
    }

    return {
      isValid: true,
    };
  };

  const handleFileInput = async (e) => {
    const fileInput = e.target.files[0];
    const validateResult = validateFileInput(fileInput);
    if (!validateResult.isValid) {
      //   setErrMsg(validateResult.message);
      setVideoFile(null);
    } else {
      setVideoFile(fileInput);
    }
  };

  const handleEditVideo = useCallback(async () => {
    try {
      const res = await videoApi.editVideo(
        videoId,
        videoFile,
        description,
        restriction,
        authUser.token,
      );
      setEditing(false);
      onSuccess(res.data.video);
    } catch (error) {
      console.log(error);
    }
  }, [videoId, videoFile, description, restriction, authUser]);

  useEffect(() => {
    if (isEditing) {
      handleEditVideo();
    }
  }, [isEditing]);

  return (
    <Modal
      title="Edit post"
      isModalVisible={isModalVisible}
      handleClose={handleClose}
    >
      <div>
        <Button variant="contained" color="secondary" component="label">
          <Typography>Choose another video</Typography>
          <input type="file" name="video" onChange={handleFileInput} hidden />
        </Button>
        {videoFile && (
          <div className="video__name">
            <CheckIcon fontSize="large" htmlColor="green" />
            <Typography>{videoFile.name}</Typography>
          </div>
        )}

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
          <InputLabel htmlFor="restrict-options" className="form__input__label">
            Ai có thể xem video này
          </InputLabel>
          <Select
            native
            inputProps={{
              name: 'restrict-options',
              id: 'restrict-options',
            }}
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
        <div className="text__center mt__1">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setEditing(true)}
          >
            {isEditing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default VideoEdit;
