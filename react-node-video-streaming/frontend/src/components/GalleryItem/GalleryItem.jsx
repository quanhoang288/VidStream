import React from 'react';
import './GalleryItem.css';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

function GalleryItem({ thumbnailUri, numLikes, numComments }) {
  return (
    <div className="gallery__item">
      <img src={thumbnailUri} className="gallery__image" alt="Thumbnail" />
      <div className="gallery__item__info">
        <ul>
          <li className="gallery__item__likes">
            <FavoriteIcon />
            {numLikes}
          </li>
          <li className="gallery__item__comments">
            <ChatBubbleIcon /> {numComments}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GalleryItem;
