const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserModel = require('../models/Users');
const VideoModel = require('../models/Videos');
const AssetModel = require('../models/Assets');
const httpStatus = require('../utils/httpStatus');
const { JWT_SECRET } = require('../configs');
const {
  ASSET_TYPE_AVATAR,
  NO_AVATAR_FILENAME,
} = require('../constants/constants');

const userController = {};

userController.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await UserModel.findOne({ username });
    if (user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Username already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userAvatar = new AssetModel({
      type: ASSET_TYPE_AVATAR,
      fileName: NO_AVATAR_FILENAME,
    });
    await userAvatar.save();

    user = new UserModel({
      username,
      password: hashedPassword,
      avatar: userAvatar._id,
    });

    const savedUser = await user.save();
    const token = jwt.sign(
      { username: savedUser.username, id: savedUser._id },
      JWT_SECRET,
    );
    return res.status(httpStatus.CREATED).json({
      user: {
        id: savedUser._id,
        username: savedUser.username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error registering new user',
    });
  }
};

userController.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username }).populate('avatar');
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Incorrect username or password',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Incorrect username or password',
      });
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      JWT_SECRET,
    );
    return res.status(httpStatus.OK).json({
      user: {
        id: user._id,
        username: user.username,
        following: user.following,
        followers: user.followers,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error logging in with given credentials',
    });
  }
};

userController.show = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id)
      .select('_id bio name username followers following')
      .populate({
        path: 'avatar',
        select: '_id fileName',
        model: 'Assets',
      })
      .populate('followers')
      .populate('following');

    const numUploadedVideos = await VideoModel.count({ uploadedBy: id });

    if (userId === id) {
      return res.status(httpStatus.OK).json({
        user: {
          ...user.toObject(),
          numUploadedVideos,
        },
      });
    }

    return res.status(httpStatus.OK).json({
      user: {
        ...user.toObject(),
        isFollowing: user.followers.findIndex((u) => u._id == userId) !== -1,
        numUploadedVideos,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error getting user information',
    });
  }
};

userController.changePassword = async (req, res) => {
  const { userId } = req;
  const { oldPassword, newPassword } = req.body;
  const user = await UserModel.findById(userId);
  const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isCorrectPassword) {
    return res.status(httpStatus.BAD_REQUEST).json({
      errorCode: 'INCORRECT_PASSWORD',
      message: 'Incorrect Password',
    });
  }
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res.status(httpStatus.BAD_REQUEST).json({
      errorCode: 'SAME_PASSWORD',
      message: 'Same password',
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await user.update({ password: hashedPassword });
  return res.status(httpStatus.OK).json({
    message: 'Update password succesfully',
  });
};

userController.changeProfile = async (req, res) => {
  const { userId } = req;
  const profileImg = req.file;
  let avatarAsset;

  try {
    const user = await UserModel.findById(userId);
    if (user.avatar) {
      avatarAsset = await AssetModel.findByIdAndUpdate(
        user.avatar,
        {
          fileName: profileImg.filename,
        },
        { new: true },
      );
    } else {
      avatarAsset = new AssetModel({
        type: ASSET_TYPE_AVATAR,
        fileName: profileImg.filename,
      });
      await avatarAsset.save();
    }

    await UserModel.findByIdAndUpdate(userId, { avatar: avatarAsset._id });

    return res.status(httpStatus.OK).json({
      avatar: avatarAsset,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error changing user profile',
    });
  }
};

userController.editInfo = async (req, res) => {
  const { userId } = req;
  const { username, name, bio } = req.body;
  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser && !existingUser._id.equals(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Username already used',
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, name, bio },
      {
        new: true,
      },
    )
      .select('_id username bio name')
      .populate('avatar');

    return res.status(httpStatus.OK).json({
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error editing user info',
    });
  }
};

userController.getVideoGallery = async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await UserModel.findById(authorId).populate({
      path: 'avatar',
      select: '_id fileName',
      model: 'Assets',
    });

    const videoGallery = await VideoModel.find({
      uploadedBy: authorId,
    }).populate({
      path: 'thumbnail',
      select: '_id fileName',
      model: 'Assets',
    });

    return res.status(httpStatus.OK).json({
      author,
      videoGallery,
    });
  } catch (err) {
    console.err(err.message);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error getting user videos' });
  }
};

userController.getSuggestedList = async (req, res) => {
  // todo: get random list
  const suggestedList = await UserModel.find({}).limit(10);
  return res.status(httpStatus.OK).json(suggestedList);
};

userController.getFollowerList = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  try {
    const authUser = await UserModel.findById(userId).populate(
      'following',
      '_id',
      'Users',
    );
    const user = await UserModel.findById(id).populate({
      path: 'followers',
      select: '_id username',
      populate: {
        path: 'avatar',
        select: '_id fileName',
        model: 'Assets',
      },
      model: 'Users',
    });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        error: 'User not found',
      });
    }
    if (userId === id) {
      return res.status(httpStatus.OK).json({
        followerList: user.followers,
      });
    }
    return res.status(httpStatus.OK).json({
      followerList: user.followers.map((follower) => ({
        ...follower.toObject(),
        isFollowing:
          authUser.following.findIndex((u) => u._id === follower._id) !== -1,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error getting followers',
    });
  }
};

userController.getFollowingList = async (req, res) => {
  const { userId } = req;

  const { id } = req.params;
  try {
    const authUser = await UserModel.findById(userId).populate(
      'following',
      '_id',
      'Users',
    );
    const user = await UserModel.findById(id).populate({
      path: 'following',
      select: '_id username',
      populate: {
        path: 'avatar',
        select: '_id fileName',
        model: 'Assets',
      },
      model: 'Users',
    });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        error: 'User not found',
      });
    }
    if (userId === id) {
      return res.status(httpStatus.OK).json({
        followingList: user.following.map((following) => ({
          ...following.toObject(),
          isFollowing: true,
        })),
      });
    }
    return res.status(httpStatus.OK).json({
      followingList: user.following.map((following) => ({
        ...following.toObject(),
        isFollowing:
          authUser.following.findIndex((u) => u._id === following._id) !== -1,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error getting following list',
    });
  }
};

userController.follow = async (req, res) => {
  const { userId } = req;
  const { userIdToFollow } = req.body;
  if (userId === userIdToFollow) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Cannot follow yourself',
    });
  }
  try {
    const user = await UserModel.findById(userId);
    const userToFollow = await UserModel.findById(userIdToFollow);
    const followingList = user.following || [];
    const followerList = userToFollow.followers || [];
    if (followerList.includes(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Already followed this user',
      });
    }

    followerList.push(userId);
    followingList.push(userIdToFollow);

    await user.update({ following: followingList });
    await userToFollow.update({ followers: followerList });

    return res.status(httpStatus.OK).json({
      message: 'Followed successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error following user',
    });
  }
};

userController.unfollow = async (req, res) => {
  const { userId } = req;
  const { userIdToUnfollow } = req.body;
  if (userId === userIdToUnfollow) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Cannot unfollow yourself',
    });
  }
  try {
    const user = await UserModel.findById(userId);
    const userToUnfollow = await UserModel.findById(userIdToUnfollow);
    const followingList = user.following || [];
    const followerList = userToUnfollow.followers || [];
    if (!followerList.includes(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Not followed this user yet',
      });
    }

    followerList.push(userId);
    followingList.push(userIdToUnfollow);

    await user.update({
      $pull: {
        following: userIdToUnfollow,
      },
    });
    await userToUnfollow.update({
      $pull: {
        followers: userId,
      },
    });

    return res.status(httpStatus.OK).json({
      message: 'Unfollowed successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error unfollowing user',
    });
  }
};

module.exports = userController;
