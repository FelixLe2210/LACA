const crypto = require("crypto");
const RefreshToken = require("../models/refreshToken.model");
const jwtUtil = require("../utils/jwt");

exports.generateAndStoreTokens = async ({ userId, req }) => {
  const accessToken = jwtUtil.generateAccessToken(userId);
  const refreshToken = jwtUtil.generateRefreshToken(userId);

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await RefreshToken.create({
    userId,
    token: hashedRefreshToken,
    userAgent: req.headers["user-agent"] || "unknown",
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};
