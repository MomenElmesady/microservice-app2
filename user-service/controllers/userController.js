const userService = require("../services/user.service.js")
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js")

exports.signUp = async (req, res) => {
  try {
    const data = req.body
    const response = await userService.signUpService(data)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// check the email exists 
// check the email is not active
// create otp amd send 
// update otp in db 
exports.resendOTP = async (req, res) => {
  try {
    const data = req.body
    const response = await userService.resendOTPService(data)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const data = req.body
    const response = await userService.verifyOTPService(data, res)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.login = async (req, res) => {
  try {
    const data = req.body
    const response = await userService.loginService(data, res)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const data = req.body
    const response = await userService.refreshTokenService(data, req)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


exports.getUser = async (req, res, next) => {
  try {
    const userId = req.userId
    const response = await userService.getUserService(userId)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.editUser = async (req, res, next) => {
  try {
    const userId = req.userId
    const data = req.body
    const response = await userService.updateUserService(userId, data)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
exports.uploadProfileImg = async (req, res, next) => {
  try {
    const userId = req.userId
    const data = req.body
    const response = await userService.uploadProfileImg(userId, data, req.file)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


exports.searchInUsers = async (req, res, next) => {
  try {
    const userId = req.userId
    const t = req.query.t
    const response = await userService.searchInUsers(userId, t)
    res.status(response.code).json(response)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getuserCurrentStatus = async (req, res, next) => {
  try {
    const userId = req.userId
    const response = await userService.getuserCurrentStatus(userId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
exports.registerFCMToken = async (req, res, next) => {
  const { userId, fcmToken } = req.body;

  if (!userId || !fcmToken) {
    return res.status(400).json({ message: 'User ID and FCM Token are required.' });
  }

  try {
    // Check if the user exists, if not create or update
    let user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'user not found.' });
    } else {
      user.fcm_token = fcmToken;  // Update token if it's already there
    }

    await user.save();

    res.status(200).json({ message: 'FCM token registered/updated successfully.' });
  } catch (err) {
    console.error('Error saving FCM token:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.protect = async (req, res, next) => {
  try {
    let token = req.headers?.authorization;
    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token in Bearer auth!" })
    }

    token = token.split(" ")[1];
    console.log(req.cookies)
    // if (!req.cookies.refreshToken) {
    //   return next(new appError("No refreshToken in cookie!", 401));
    // }
    // more security-> may compare it with the stored in db
    if (!req.cookies?.refreshToken) {
      return res.status(401).json({ message: "No refreshToken found in cookie" })
    }
    let decoded
    try {
      decoded = await promisify(jwt.verify)(token, process.env.ACCESS_SECRET);
    } catch (err) {
      console.log(err)
      return res.status(401).json({ message: "Unable to verify token" })
    }
    console.log(decoded)
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
};