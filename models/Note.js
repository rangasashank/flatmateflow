import mongoose from "mongoose"
import {Schema, model} from "mongoose"
const noteSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoommateGroup',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }, { timestamps: true });
  
  export default model('Note', noteSchema);