const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate Access Token (Short-Lived)
function generateAccessToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_SECRET, { expiresIn: "1d" });
}

// Generate Refresh Token (Long-Lived)
function generateRefreshToken(user) {
    return jwt.sign({ id: user.id,  email: user.email }, process.env.REFRESH_SECRET, { expiresIn: "30d" });
}

module.exports = { generateAccessToken, generateRefreshToken };
