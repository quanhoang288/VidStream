import React from 'react';
import './GalleryItem.css';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { useHistory } from 'react-router-dom';
import { ASSET_BASE_URL } from '../../configs';

function GalleryItem({ video }) {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/videos/${video._id}/`);
  };

  return (
    <div className="gallery__item">
      <img
        src={`${ASSET_BASE_URL}/${video.thumbnail.fileName}`}
        className="gallery__image"
        alt="Thumbnail"
      />
      <div className="gallery__item__info" onClick={handleClick}>
        <ul>
          <li className="gallery__item__likes">
            <FavoriteIcon />
            {video.numLikes}
          </li>
          <li className="gallery__item__comments">
            <ChatBubbleIcon /> {video.numComments}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GalleryItem;
