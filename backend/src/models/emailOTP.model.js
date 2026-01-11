const mongoose = require("mongoose");

const emailOTPSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiredAt: {
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
