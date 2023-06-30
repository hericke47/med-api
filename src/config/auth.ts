export default {
  secretToken: process.env.SECRET_TOKEN ?? "secrettoken",
  expiresInToken: "7d",
  secretRefreshToken: process.env.SECRET_REFRESH_TOKEN ?? "secretrefreshtoken",
  expiresInRefreshToken: "30d",
  expiresRefreshTokenDays: 30,
};
