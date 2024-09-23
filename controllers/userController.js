const User = require('../models/User');
const RoommateGroup = require('../models/RoommateGroup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};