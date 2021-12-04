const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users');
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

module.exports = userController;
