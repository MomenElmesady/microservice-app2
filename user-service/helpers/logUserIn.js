const generateToken = require("./generateToken")

exports.logUserIn = (res, user) => {
  const accessToken = generateToken.generateAccessToken(user)
  const refreshToken = generateToken.generateRefreshToken(user)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
  return { accessToken, refreshToken }
}