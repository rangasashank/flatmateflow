import mongoose from "mongoose";
import {Schema, model} from "mongoose"
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'RoommateGroup', required: true },
  completed: { type: Boolean, default: false },
  isRecurring: { type: Boolean, default: false }, // Flag for recurring task
  recurrenceInterval: { type: Number, default: 7 }, // Days between recurrence
  recurrenceNextDueDate: { type: Date }, // Next recurrence date
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the task
  }, { timestamps: true });
  
  export default model('Task', taskSchema);