import mongoose from "mongoose";

const ManagementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["SchoolHead", "InventoryHead", "LetterHead", "ConductHead"],
  },
  phone: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Ensure correct model name and schema registration
const Management =
  mongoose.models.Management || mongoose.model("Management", ManagementSchema);

export default Management;
