// models/letterLog.js
import mongoose from "mongoose";

const letterLogSchema = new mongoose.Schema(
  {
    letterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Letter",
      required: true,
    },
    actionType: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modifiedAt: { type: Date, default: Date.now },
    additionalInfo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.LetterLog ||
  mongoose.model("LetterLog", letterLogSchema);
