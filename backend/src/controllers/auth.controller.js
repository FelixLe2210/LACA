require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const EmailOTP = require("../models/emailOTP.model");
const { generateOTPToken } = require("../utils/jwt");
const authService = require("../services/auth.service");
const {
  USERNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_LENGTH_MAX,
} = process.env;
const emailService = require("../services/email.service");

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, password, confirmPassword } = req.body;
    if (!fullname || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Bad request" });
    }

    const isUsernameLengthValid = await authService.checkUsernameLength(
      username
    );
    if (!isUsernameLengthValid) {
      return res.status(400).json({
        message: `Username must be between ${USERNAME_LENGTH_MIN} and ${USERNAME_LENGTH_MAX} characters`,
      });
    }

    const isEmailExists = await authService.checkEmail(email);
    if (isEmailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const isUsernameExists = await authService.checkUsername(username);
    if (isUsernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const isPasswordLengthValid = await authService.checkPasswordLength(
      password
    );
    if (!isPasswordLengthValid) {
      return res.status(400).json({
        message: `Password must be between ${PASSWORD_LENGTH_MIN} and ${PASSWORD_LENGTH_MAX} characters`,
      });
    }

    const isPasswordMatch = await authService.comparePassword(
      password,
      confirmPassword
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      isActive: false,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const plainOTP = authService.generateOTP();
    const hashedOTP = await bcrypt.hash(
      plainOTP,
      parseInt(process.env.SALT_ROUNDS)
    );

    const otp = await EmailOTP.create({
      userID: user._id,
      email: user.email,
      otp: hashedOTP,
      expiredAt: authService.generateOTPExpiredAt(),
      isUsed: false,
      attempts: 0,
    });

    await emailService.sendOTPRegister(user.email, plainOTP);
    return res.status(201).json({
      success: true,
      message: "OTP đã được gửi về email",
      data: {
        OTPToken: generateOTPToken(user._id, otp._id),
        expiredAt: otp.expiredAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
