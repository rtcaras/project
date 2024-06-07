const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/usermodel');
const { Admin } = require('mongodb');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const {email} = req.user;
  const adminUser = await user.findOne({email});
  if (adminUser.role !=="admin"){
    throw new Error("You are not an Admin");
  }
  else{
    next();
  }
})

module.exports = { protect, isAdmin };
