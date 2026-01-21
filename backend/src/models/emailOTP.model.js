const mongoose = require("mongoose");

const emailOTPSchema = new mongoose.Schema(
  {
    otpToken: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    otp: {
      type: String, // OTP đã hash
      required: true,
    },

    purpose: {
      type: String,
      required: true,
      enum: ["REGISTER", "RESET_PASSWORD"],
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
  },
  { timestamps: true }
);

// Mỗi user chỉ có 1 OTP active cho mỗi purpose
emailOTPSchema.index({ userId: 1, purpose: 1 }, { unique: true });

// Tự xoá OTP hết hạn
emailOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EmailOTP", emailOTPSchema);
