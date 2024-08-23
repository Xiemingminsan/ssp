const mongoose = require("mongoose");

const ManagementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
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
});

// Check if the model already exists
const Management =
  mongoose.models.Management || mongoose.model("Management", ManagementSchema);

module.exports = Management;
