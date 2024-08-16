import mongoose from "mongoose";

const letterSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    dateReceived: { type: Date },
    description: { type: String },
    dateSent: { type: Date },
    status: { type: String, enum: ["received", "sent"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Letter || mongoose.model("Letter", letterSchema);
