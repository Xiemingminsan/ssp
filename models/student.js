import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  profilepicture: { type: String }, // Assuming this is a URL or file path
  birthdate: { type: Date, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "batch", required: true }, // Reference to Batch (Grade)
  batchname: { type: String, required: true },
  mothername: { type: String },
  gender: { type: String },
  christianname: { type: String },
  previoussundayschool: { type: String },
  previoussundayschoolstart: { type: Date },
  previoussundayschoolend: { type: Date },
  highereducation: { type: String },
  institutionname: { type: String },
  highereducationstart: { type: Date },
  highereducationend: { type: Date },
  graduatedin: { type: String },
  registrationday: { type: Date, default: Date.now },
  city: { type: String },
  subcity: { type: String },
  kebele: { type: String },
  woreda: { type: String },
  phone: { type: String },
  postalnumber: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  employmenttype: { type: String },
  companyname: { type: String },
  companyaddress: { type: String },
  educationlevel: { type: String },
  maritalstatus: { type: String },
  livewith: { type: String },
  talentsinterests: { type: String },
  preferredworkarea: { type: String },
  emergencycontactname: { type: String },
  emergencycontactphone: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }], // Array of courses student is enrolled in
  attendance: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Permission"],
        required: true,
      },
    },
  ],
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
