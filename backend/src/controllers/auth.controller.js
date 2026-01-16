require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const EmailOTP = require("../models/emailOTP.model");
const authService = require("../services/auth.service");
const { randomUUID } = require("crypto");
const { setRefreshTokenCookie } = require("../utils/cookie");
const emailService = require("../services/email.service");
const AppError = require("../utils/appError");
const tokenService = require("../services/token.service");

const asyncHandler = require("../utils/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, confirmPassword } = req.body;

  await authService.verifyRegister(
    fullname,
    username,
    email,
    password,
    confirmPassword
  );

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  const user = await User.create({
    fullname,
    username,
    email,
    password: hashedPassword,
    isActive: false,
    isEmailVerified: false,
  });

  const plainOTP = authService.generateOTP();
  const hashedOTP = await bcrypt.hash(
    plainOTP,
    Number(process.env.SALT_ROUNDS)
  );

  const otp = await EmailOTP.create({
    otpToken: randomUUID(),
    userId: user._id,
    otp: hashedOTP,
    expiresAt: authService.generateOTPExpiredAt(),
    isUsed: false,
    attempts: 0,
  });

  await emailService.sendOTPRegister(user.email, plainOTP);

  res.status(201).json({
    success: true,
    message: "OTP has been sent to your email",
    data: {
      otpToken: otp.otpToken,
      expiresAt: otp.expiresAt,
    },
  });
});

exports.verifyOTP = asyncHandler(async (req, res) => {
  const { otpToken, otpCode } = req.body;

  if (!otpToken || !otpCode) {
    throw new AppError("otpToken and otpCode are required", 400);
  }

  const { userId } = await emailService.verifyOTP({
    otpToken,
    otpCode,
  });

  const { accessToken, refreshToken } =
    await tokenService.generateAndStoreTokens({
      userId,
      req,
    });

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: "OTP validation success",
    data: { accessToken },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.verifyLogin(email, password);

  const { accessToken, refreshToken } =
    await tokenService.generateAndStoreTokens({
      userId: user._id,
      req,
    });

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: "Login success",
    data: { accessToken },
  });
});
