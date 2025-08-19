import mongoose from "mongoose";
import taskSchemaa from "./TaskSchema.js";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["active", "completed", "pending"],
    default: "active",
  },
  tasks: [taskSchemaa],
});

export default ProjectSchema;
