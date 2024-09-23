const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoommateGroup',
      },
})