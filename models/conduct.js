import mongoose from "mongoose";

const conductSchema = new mongoose.Schema(
  {
    person: { type: String, required: true },
    action: { type: String, required: true },
    reason: { type: String, required: true },
    punishment: { type: String, required: true },
    punishmentEndDate: { type: Date },
    log: [
      {
        actionType: { type: String },
        modifiedBy: { type: String },
        modifiedAt: { type: Date },
        additionalInfo: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Conduct ||
  mongoose.model("Conduct", conductSchema);
