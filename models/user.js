import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordhash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['admin', 'user', 'manager'] }
});

export default mongoose.models.user || mongoose.model('user', userSchema);