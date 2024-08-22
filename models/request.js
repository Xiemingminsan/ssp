import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "item", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    requestType: { type: String, enum: ["takeOut", "return"], required: true },
    loanStatus: {
      type: String,
      enum: ["onLoan", "returned"],
      default: "onLoan",
    },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    dueDate: { type: Date }, // Optional, for return deadline
    logs: [
      {
        actionType: {
          type: String,
          enum: ["requestCreated", "requestApproved", "requestDenied"],
          required: true,
        },
        previousState: {
          status: { type: String },
          quantity: { type: Number },
        },
        newState: {
          status: { type: String },
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
  },
  { timestamps: true }
);

export default mongoose.models.request ||
  mongoose.model("request", requestSchema);
