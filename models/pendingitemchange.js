import mongoose from 'mongoose';

const pendingItemChangeSchema = new mongoose.Schema({
    inventoryid: { type: mongoose.Schema.Types.ObjectId, ref: 'inventory', required: true, index: true },
    requestedquantity: { type: Number, required: true, min: 1 },
    requestedby: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    approvedby: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'] },
    requesteddate: { type: Date, default: Date.now },
    approveddate: Date
});

export default mongoose.models.pendingitemchange || mongoose.model('pendingitemchange', pendingItemChangeSchema);