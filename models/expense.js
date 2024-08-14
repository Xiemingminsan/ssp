import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    addedby: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
});

export default mongoose.models.expense || mongoose.model('expense', expenseSchema);