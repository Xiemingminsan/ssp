import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema({
    inventoryid: { type: mongoose.Schema.Types.ObjectId, ref: 'inventory', required: true, index: true },
    change: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    changedby: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
});

export default mongoose.models.inventorylog || mongoose.model('inventorylog', inventoryLogSchema);