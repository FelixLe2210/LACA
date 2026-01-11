const sendEmail = require("../utils/mailer");

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
