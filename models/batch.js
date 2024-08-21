import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  startDate: { type: Date },
  endDate: { type: Date },
});

// Check if the model already exists before defining it
const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);

export default Batch;
