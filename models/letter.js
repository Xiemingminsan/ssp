import mongoose from 'mongoose';

const letterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    typeofletter: { type: String, required: true },
    destination: { type: String, required: true },
    sentby: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true }
});

export default mongoose.models.letter || mongoose.model('letter', letterSchema);