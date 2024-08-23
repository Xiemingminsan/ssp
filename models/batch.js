import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  startDate: { type: Date },
  endDate: { type: Date },
});

<<<<<<< Updated upstream
// Check if the model already exists before defining it
=======
>>>>>>> Stashed changes
const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);

export default Batch;
