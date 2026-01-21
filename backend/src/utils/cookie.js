exports.refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  // sameSite: "none", Nếu FE & BE khác domain
  // secure: true, Nếu FE & BE khác domain
  // secure: false Nếu localhost dev
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

exports.setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    ...this.refreshTokenCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

exports.clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", this.refreshTokenCookieOptions);
};
