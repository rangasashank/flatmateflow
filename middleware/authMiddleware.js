import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

export const protect = async (req, res, next) => {
  
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Not authorized, token failed');
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const protectGroup = async (req, res, next) => {
    const {token} = req.cookies;
      if(!token) {
          return res.status(404).json({
              success: false,
              message: "Not logged in",
          });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded._id);
      if ((req.user.group) || (req.user.group.groupName != "" )) {
        next()
      } else {
        return res.status(404).json({
            success: false,
            message: "Not in a group",
        });
      }
      
}