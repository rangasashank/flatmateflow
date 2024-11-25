import {User} from '../models/User.js';
import RoommateGroup from '../models/RoommateGroup.js';
import bcrypt from'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendCookie } from "../utils/features.js"

// register a new user
export const register = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        sendCookie(user, res,`Registered Succesfully ${user.name}`, 200)

        

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getUserProfile = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        group: req.user.group || null, // Include the group if applicable
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// login user
export const login = async (req, res) => {
    const {token} = req.cookies;
      if(token) {
          return res.status(404).json({
              success: false,
              message: "Already logged in",
          });
      }

    const {email, password} = req.body;


    try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

          sendCookie(user, res,`Welcome Back ${user.name}`, 200)

    } catch (error) {
        res.status(500).json({error: error.message});
    }

};

// logout the user
export const logout = async (req, res) => {

    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,

    }).json({
        success: true,
        user: req.user._id,
    })
}

//delete user
export const deleteUser= async (req, res) => {

    try{
    const {password} = req.body;

    const isMatch = await bcrypt.compare(password, req.user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Wrong password' });
    }

    if (req.user.group !== undefined && req.user.group !== null) {
        const group = await RoommateGroup.findById(req.user.group);
        if (group) {
          group.members = group.members.filter(member => member.toString() !== req.user._id.toString());
          await group.save();
        }
      }

    await User.findByIdAndDelete(req.user._id);
    res.status(201).json({success: true, user: req.user._id,})

    } catch (error) {
        res.status(500).json({error: error.message})
}
}
