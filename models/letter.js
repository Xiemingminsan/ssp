import mongoose from "mongoose";

const letterSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["received", "sent"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Letter || mongoose.model("Letter", letterSchema);
