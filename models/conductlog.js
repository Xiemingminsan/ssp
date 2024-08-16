// models/conductLog.js
import mongoose from "mongoose";

const conductLogSchema = new mongoose.Schema(
  {
    conductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conduct", // Reference to the Conduct model
      required: true,
    },
    actionType: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
    additionalInfo: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ConductLog ||
  mongoose.model("ConductLog", conductLogSchema);
