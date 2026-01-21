require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const EmailOTP = require("../models/emailOTP.model");
const AuthService = require("../services/auth.service");
const { randomUUID } = require("crypto");
const {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("../utils/cookie");
const EmailService = require("../services/email.service");
const AppError = require("../utils/appError");
const tokenService = require("../services/token.service");
const RefreshToken = require("../models/refreshToken.model");
const asyncHandler = require("../utils/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, confirmPassword } = req.body;

  await AuthService.verifyRegister(
    fullname,
    username,
    email,
    password,
    confirmPassword,
  );

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS),
  );

  const user = await User.create({
    fullname,
    username,
    email,
    password: hashedPassword,
    isActive: false,
    isEmailVerified: false,
  });

  const plainOTP = AuthService.generateOTP();
  const hashedOTP = await bcrypt.hash(
    plainOTP,
    Number(process.env.SALT_ROUNDS),
  );

  const otp = await EmailOTP.create({
    otpToken: randomUUID(),
    userId: user._id,
    otp: hashedOTP,
    purpose: "REGISTER",
    expiresAt: AuthService.generateOTPExpiredAt(),
    isUsed: false,
    attempts: 0,
  });

  await EmailService.sendOTP(user.email, plainOTP, "REGISTER");

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

  const { userId, purpose } = await EmailService.verifyOTP({
    otpToken,
    otpCode,
  });

  if (purpose === "REGISTER") {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isEmailVerified: true,
        isActive: true,
      },
      { new: true },
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { accessToken, refreshToken } =
      await tokenService.generateAndStoreTokens({
        userId,
        req,
      });

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      data: { accessToken },
    });
  }

  if (purpose === "RESET_PASSWORD") {
    return res.status(200).json({
      success: true,
      message: "OTP verified",
      data: { otpToken },
    });
  }

  throw new AppError("Unsupported OTP purpose", 400);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await AuthService.verifyLogin(email, password);

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

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { otpToken } = await AuthService.forgotPassword(email);
  return res.status(200).json({
    success: true,
    message: "OTP has been sent to your email",
    otpToken,
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { otpToken, password, confirmPassword } = req.body;
  await AuthService.resetPassword({ otpToken, password, confirmPassword });
  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await RefreshToken.deleteOne({ token: hashedToken });
  }

  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
