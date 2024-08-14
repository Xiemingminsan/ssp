import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

export default mongoose.model("batch", batchSchema) || mongoose.models.Batch;
