import mongoose from 'mongoose'
import {Schema, model} from "mongoose"
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoommateGroup',
      },
})

export const User = mongoose.model("User", schema);