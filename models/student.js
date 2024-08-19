import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "batch", required: true }, // Reference to Batch (Grade)
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }], // Array of courses student is enrolled in
  birthdate: { type: Date, required: true },
  profilepicture: String,
  registrationday: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true, index: true },
  attendance: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Excused"],
        required: true,
      },
    },
  ],
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
