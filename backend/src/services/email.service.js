const sendEmail = require("../utils/mailer");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
const OTP = require("../models/emailOTP.model");

exports.verifyOTP = async ({ otpToken, otpCode }) => {
  const otp = await OTP.findOne({ otpToken });
  if (!otp) {
    throw new AppError("OTP không tồn tại", 400);
  }
  if (otp.isUsed) {
    throw new AppError("OTP đã được sử dụng", 400);
  }
  // if (otp.expiresAt < new Date()) {
  //   throw new AppError("OTP đã hết hạn", 400);
  // }
  if (otp.attempts >= 5) {
    throw new AppError("OTP đã bị khóa do nhập sai quá nhiều lần", 429);
  }
  const isMatch = await bcrypt.compare(otpCode, otp.otp);
  if (!isMatch) {
    otp.attempts += 1;
    await otp.save();
    throw new AppError("OTP không đúng", 400);
  }

  otp.isUsed = true;
  await otp.save();
  return {
    userId: otp.userId,
  };
};

exports.sendOTPRegister = async (email, otp) => {
  const subject = "Mã xác thực đăng ký tài khoản";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #4CAF50; text-align: center;">Xác thực tài khoản</h2>
      <p>Chào bạn,</p>
      <p>Mã OTP của bạn là: <b style="font-size: 24px; color: #ff5722;">${otp}</b></p>
      <p>Mã này sẽ hết hạn sau <b>${
        process.env.OTP_EXPIRED_IN / 60 / 1000
      } phút</b>.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng kiểm tra lại tài khoản của bạn.</p>
    </div>
  `;

  await sendEmail({ email, subject, html });
};
