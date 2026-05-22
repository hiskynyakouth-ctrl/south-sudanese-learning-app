const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:                { type: String, required: true, trim: true },
  email:               { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:            { type: String, required: true },
  googleId:            { type: String, trim: true },
  picture:             { type: String, trim: true },
  role:                { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  subscription_plan:   { type: String, default: "" },
  subscription_expiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);