const bcrypt = require("bcryptjs");
const RefreshToken = require("../models/refreshToken.model");
const jwtUtil = require("../utils/jwt");

exports.generateAndStoreTokens = async ({ userId, req, res }) => {
  const accessToken = jwtUtil.generateAccessToken(userId);
  const refreshToken = jwtUtil.generateRefreshToken(userId);

  const hashedRefreshToken = await bcrypt.hash(
    refreshToken,
    Number(process.env.SALT_ROUNDS)
  );

  await RefreshToken.create({
    userId,
    token: hashedRefreshToken,
    userAgent: req.headers["user-agent"] || "unknown",
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isRevoked: false,
  });

  return { accessToken, refreshToken };
};
