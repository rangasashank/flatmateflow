import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  
      const {token} = req.cookies;
      if(!token) {
          return res.status(404).json({
              success: false,
              message: "Not logged in",
          });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded._id);
      next()
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