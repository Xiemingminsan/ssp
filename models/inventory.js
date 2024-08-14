import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, min: 0 }
});

export default mongoose.models.inventory || mongoose.model('inventory', inventorySchema);