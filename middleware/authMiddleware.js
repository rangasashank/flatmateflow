import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

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