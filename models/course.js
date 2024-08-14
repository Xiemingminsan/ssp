import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., Math, Science
  description: { type: String }, // Optional: to give a brief about the course
  // No reference to batch here to allow flexibility
});

export default mongoose.model("course", courseSchema) || mongoose.models.Course;
