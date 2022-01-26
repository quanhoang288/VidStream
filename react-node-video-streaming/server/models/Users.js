const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  bio: {
    type: String,
    required: false,
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assets',
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
});

userSchema.set('timestamps', true);
module.exports = mongoose.model('Users', userSchema);
