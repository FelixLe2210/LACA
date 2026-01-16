const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const EmailOTP = require("../models/emailOTP.model");
const AppError = require("../utils/appError");

const {
  USERNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_LENGTH_MAX,
} = process.env;

exports.checkEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    return true;
  }
  return false;
};

exports.checkUsername = async (username) => {
  const user = await User.findOne({ username });
  if (user) {
    return true;
  }
  return false;
};

exports.checkUsernameLength = async (username) => {
  if (
    username.length < USERNAME_LENGTH_MIN ||
    username.length > USERNAME_LENGTH_MAX
  ) {
    return false;
  }
  return true;
};

exports.checkPasswordLength = async (password) => {
  if (
    password.length < PASSWORD_LENGTH_MIN ||
    password.length > PASSWORD_LENGTH_MAX
  ) {
    return false;
  }
  return true;
};

exports.comparePassword = async (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return false;
  }
  return true;
};

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// exports.verifyOTP = async (otp, otpID) => {
//   const otpObject = await EmailOTP.findOne({ _id: otpID });
//   return bcrypt.compareSync(otp, otpObject.otp);
// };

exports.generateOTPExpiredAt = () => {
  return new Date(Date.now() + Number(process.env.OTP_EXPIRED_IN));
};

exports.verifyLogin = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }
  if (!this.checkEmail(email)) {
    throw new AppError("Email is not valid", 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.isActive) {
    throw new AppError("User is not active", 400);
  }
  if (!user.isEmailVerified) {
    throw new AppError("User is not verified", 400);
  }
  if (!this.comparePassword(password, user.password)) {
    throw new AppError("Password is not valid", 400);
  }
  return user;
};

exports.verifyRegister = async (
  fullname,
  username,
  email,
  password,
  confirmPassword
) => {
  if (!email || !password || !username || !fullname || !confirmPassword) {
    throw new AppError("Bad request", 400);
  }

  const isUsernameLengthValid = await this.checkUsernameLength(username);
  if (!isUsernameLengthValid) {
    throw new AppError(
      `Username must be between ${USERNAME_LENGTH_MIN} and ${USERNAME_LENGTH_MAX} characters`,
      400
    );
  }

  const isEmailExists = await this.checkEmail(email);
  if (isEmailExists) {
    throw new AppError("Email already exists", 400);
  }

  const isUsernameExists = await this.checkUsername(username);
  if (isUsernameExists) {
    throw new AppError("Username already exists", 400);
  }

  const isPasswordLengthValid = await this.checkPasswordLength(password);
  if (!isPasswordLengthValid) {
    throw new AppError(
      `Password must be between ${PASSWORD_LENGTH_MIN} and ${PASSWORD_LENGTH_MAX} characters`,
      400
    );
  }

  const isPasswordMatch = await this.comparePassword(password, confirmPassword);
  if (!isPasswordMatch) {
    throw new AppError("Password does not match", 400);
  }
  return true;
};
