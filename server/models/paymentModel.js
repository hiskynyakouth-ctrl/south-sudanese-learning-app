const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email:    { type: String, required: true },
  tx_ref:   { type: String },
  amount:   { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  provider: { type: String, default: '' },
  status:   { type: String, default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
