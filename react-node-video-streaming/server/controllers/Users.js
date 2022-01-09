const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users');
const VideoModel = require('../models/Videos');
const httpStatus = require('../utils/httpStatus');
const { JWT_SECRET } = require('../configs');

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

    user = new UserModel({
      username,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = jwt.sign(
      { username: savedUser.username, id: username._id },
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
    const user = await UserModel.findOne({ username });
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
      { username: user.username, id: username._id },
      JWT_SECRET,
    );
    return res.status(httpStatus.OK).json({
      user: {
        id: user._id,
        username: user.username,
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
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId)
      .select('_id username followers following')
      .populate({
        path: 'avatar',
        select: '_id fileName',
        model: 'Assets',
      })
      .populate('followers')
      .populate('following');

    const numUploadedVideos = await VideoModel.count({ uploadedBy: userId });

    return res.status(httpStatus.OK).json({
      user: {
        ...user.toObject(),
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

module.exports = userController;
