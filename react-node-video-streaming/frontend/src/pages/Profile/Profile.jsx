import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import Main from '../../containers/Main/Main';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import './Profile.css';

function Profile() {
  // TODO: get video gallery of current user
  const videoGallery = [
    {
      thumbnailUri:
        'https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces',
      numLikes: 58,
      numComments: 10,
    },
    {
      thumbnailUri:
        'https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces',
      numLikes: 60,
      numComments: 20,
    },
    {
      thumbnailUri:
        'https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces',
      numLikes: 6230,
      numComments: 130,
    },
  ];

  return (
    <Main>
      <div className="main__wrapper">
        <div className="profile">
          <div className="profile__image">
            <img
              src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces"
              alt=""
            />
          </div>

          <div className="profile__user__settings">
            <h1 className="profile__username">Quan Hoang</h1>

            <button type="button" className="btn profile__edit__btn">
              Edit Profile
            </button>

            <SettingsIcon className="profile__settings__btn" />
          </div>

          <div className="profile__stats">
            <ul>
              <li>
                <span className="profile__stat__count">164</span> videos
              </li>
              <li>
                <span className="profile__stat__count">188</span> followers
              </li>
              <li>
                <span className="profile__stat__count">206</span> following
              </li>
            </ul>
          </div>
        </div>

        <div className="gallery">
          {videoGallery.map((video) => (
            <GalleryItem {...video} />
          ))}
        </div>
      </div>
    </Main>
  );
}

export default Profile;
