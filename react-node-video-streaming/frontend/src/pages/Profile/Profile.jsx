import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Main from '../../containers/Main/Main';
import './Profile.css';
// import { Grid } from '@material-ui/core';

function Profile() {
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
          <div className="gallery__item">
            <img
              src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop"
              className="gallery__image"
              alt=""
            />

            <div className="gallery__item__info">
              <ul>
                <li className="gallery__item__likes">
                  <FavoriteIcon />
                  56
                </li>
                <li className="gallery__item__comments">
                  <ChatBubbleIcon /> 2
                </li>
              </ul>
            </div>
          </div>

          <div className="gallery__item">
            <img
              src="https://images.unsplash.com/photo-1497445462247-4330a224fdb1?w=500&h=500&fit=crop"
              className="gallery__image"
              alt=""
            />

            <div className="gallery__item__info">
              <ul>
                <li className="gallery__item__likes">
                  <FavoriteIcon />
                  89
                </li>
                <li className="gallery__item__comments">
                  <ChatBubbleIcon /> 5
                </li>
              </ul>
            </div>
          </div>

          <div className="gallery__item">
            <img
              src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&h=500&fit=crop"
              className="gallery__image"
              alt=""
            />

            <div className="gallery__item__info">
              <ul>
                <li className="gallery__item__likes">
                  <FavoriteIcon />
                  42
                </li>
                <li className="gallery__item__comments">
                  <ChatBubbleIcon /> 1
                </li>
              </ul>
            </div>
          </div>

          <div className="gallery__item">
            <img
              src="https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop"
              className="gallery__image"
              alt=""
            />

            <div className="gallery__item__info">
              <ul>
                <li className="gallery__item__likes">
                  <FavoriteIcon />
                  38
                </li>
                <li className="gallery__item__comments">
                  <ChatBubbleIcon /> 0
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Profile;
