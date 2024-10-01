import mongoose from "mongoose"
import {Schema, model} from "mongoose"
const expenseSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoommateGroup',
      required: true,
    },
    splitAmong: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  }, { timestamps: true });
  
  export default model('Expense', expenseSchema);