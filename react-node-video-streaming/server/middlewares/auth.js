const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs');
const UserModel = require('../models/Users');
const httpStatus = require('../utils/httpStatus');

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(authorization, JWT_SECRET);
    } catch (e) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'unauthorized',
      });
    }
    const userId = decoded.id;
    const user = await UserModel.findById(userId);
    if (user == null) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'UNAUTHORIZED',
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = auth;
