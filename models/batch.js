import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., Grade 1, Grade 2
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }], // Array of courses in this batch
});

export default mongoose.models.Batch || mongoose.model('batch', batchSchema);
