import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Optional for
});

const Task = model('Task', taskSchema);
export { Task };
