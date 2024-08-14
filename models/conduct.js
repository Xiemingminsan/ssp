import mongoose from 'mongoose';

const conductSchema = new mongoose.Schema({
    studentid: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true, index: true },
    name: { type: String, required: true },
    typeofmisconduct: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    description: String
});

export default mongoose.models.conduct || mongoose.model('conduct', conductSchema);