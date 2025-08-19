import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignTo: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'done', 'overdue'],
    default: 'to-do',
  },
});

export default taskSchema;
