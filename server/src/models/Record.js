const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({ owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, kind: { type: String, enum: ['restaurant', 'ngo', 'donation'], required: true, index: true }, data: { type: mongoose.Schema.Types.Mixed, required: true } }, { timestamps: true });
module.exports = mongoose.model('Record', recordSchema);
