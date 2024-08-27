import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  reason: { type: String },
  place: { type: String },
  phone: { type: String },
  booker: { type: String },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
