import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true }, // available = total - loaned
  loanedQuantity: { type: Number, default: 0 }, // Track loaned quantity
  loanedItems: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      quantity: { type: Number },
      dueDate: { type: Date },
    },
  ],
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  lastModifiedAt: { type: Date, default: Date.now },
  logs: [
    {
      actionType: {
        type: String,
        enum: ["update", "requestApproval", "requestDenial", "delete"],
        required: true,
      },
      previousState: {
        name: { type: String },
        description: { type: String },
        quantity: { type: Number },
      },
      newState: {
        name: { type: String },
        description: { type: String },
        quantity: { type: Number },
      },
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      modifiedAt: { type: Date, default: Date.now },
      additionalInfo: { type: String },
    },
  ],
  isArchived: { type: Boolean, default: false }, // New field
});

export default mongoose.models.item || mongoose.model("item", itemSchema);
