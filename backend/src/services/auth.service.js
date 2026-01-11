const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const EmailOTP = require("../models/emailOTP.model");

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

exports.verifyOTP = async (otp, otpID) => {
  const otpObject = await EmailOTP.findOne({ _id: otpID });
  return bcrypt.compareSync(otp, otpObject.otp);
};

exports.generateOTPExpiredAt = () => {
  return new Date(Date.now() + Number(process.env.OTP_EXPIRED_IN));
};
