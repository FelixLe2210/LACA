const mongoose = require("mongoose");

const emailOTPSchema = new mongoose.Schema({
  otpToken: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("EmailOTP", emailOTPSchema);
