require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const EmailOTP = require("../models/emailOTP.model");
const jwtUtil = require("../utils/jwt");
const authService = require("../services/auth.service");
const { randomUUID } = require("crypto");
const { setRefreshTokenCookie } = require("../utils/cookie");
const {
  USERNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_LENGTH_MAX,
} = process.env;
const emailService = require("../services/email.service");
const RefreshToken = require("../models/refreshToken.model");

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
      otpToken: randomUUID(),
      userId: user._id,
      otp: hashedOTP,
      expiresAt: authService.generateOTPExpiredAt(),
      isUsed: false,
      attempts: 0,
    });

    await emailService.sendOTPRegister(user.email, plainOTP);
    return res.status(201).json({
      message: "OTP has been sent to your email",
      data: {
        otpToken: otp.otpToken,
        expiresAt: otp.expiresAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otpToken, otpCode } = req.body;

    if (!otpToken || !otpCode) {
      return res.status(400).json({
        message: "otpToken and otpCode are required",
      });
    }

    const { userId } = await emailService.verifyOTP({
      otpToken,
      otpCode,
    });
    const accessToken = jwtUtil.generateAccessToken(userId);
    const refreshToken = jwtUtil.generateRefreshToken(userId);

    const tokenHash = await bcrypt.hash(
      refreshToken,
      Number(process.env.SALT_ROUNDS)
    );
    await RefreshToken.create({
      userId,
      token: tokenHash,
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isRevoked: false,
    });

    setRefreshTokenCookie(res, refreshToken);
    return res.status(200).json({
      success: true,
      message: "OTP validation success",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(error);
    return res.status(statusCode).json({
      message: error.message || "Internal server error",
    });
  }
};
