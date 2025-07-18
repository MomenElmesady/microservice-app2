const userRepository = require("../repositories/userRepository")
const generateOTP = require("../helpers/generateOTP")
const sendOTP = require("../config/nodemailer")
const generateToken = require("../helpers/generateToken")
const { logUserIn } = require("../helpers/logUserIn")
const bcrypt = require("bcrypt")
const { promisify } = require("util");
const jwt = require("jsonwebtoken");




// 1- check email, password, name, phone_number found
// 2- check email not exist 
// 3- generate OTP with expiration 
// 4- create new record in database 
exports.signUpService = async (data) => {
  try {
    const { email, name, password, phone_number } = data
    if (!email || !name || !name || !phone_number) {
      return { code: 400, message: 'Missed data!' }
    }
    let user = await userRepository.getUserByEmail(data.email)
    if (user) {
      return { code: 404, message: 'user already found!' }
    }
    // only email in unique 
    // user = await userRepository.getUserByNumber(data.phone_number)
    // if (user) {
    //   return { code: 404, message: 'user with this number already found!' }
    // }
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    let newUser = {
      email,
      password,
      name,
      phone_number,
      otp,
      otpExpiresAt
    }
    await sendOTP(data.email, otp)
    await userRepository.createUser(newUser)
    return { code: 201, message: "OTP Sent to the email" }

  } catch (error) {
    console.log(error)
    throw `Error in signup service ${error.message}`
  }
}


// check the email exists 
// check the email is not active
// create otp amd send 
// update otp in db 
exports.resendOTPService = async (data) => {
  try {
    const { email } = data
    if (!email) {
      return { code: 400, message: 'Missed data!' }
    }
    let user = await userRepository.getUserByEmail(data.email)
    if (!user) {
      return { code: 404, message: 'user not found' }
    }

    if (user.isVerified) {
      return { code: 404, message: 'user already active' }
    }
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    await sendOTP(data.email, otp)
    user.otp = otp
    user.otpExpiresAt = otpExpiresAt
    await user.save()
    return { code: 201, message: "OTP Sent to the email" }

  } catch (error) {
    console.log(error)
    throw `Error in resendOTPService service ${error.message}`
  }
}

exports.verifyOTPService = async (data, res) => {
  try {
    const { email, otp } = data
    if (!email) {
      return { code: 400, message: 'Missed data!' }
    }
    let user = await userRepository.getUserByEmail(data.email)
    if (!user) {
      return { code: 404, message: 'user not found' }
    }
    if (user.otp != otp) {
      return { code: 404, message: 'wrong otp!!' }
    }
    user.otp = null
    user.otpExpiresAt = null
    user.isVerified = true
    await user.save()
    console.log(logUserIn, typeof logUserIn)
    const { accessToken } = logUserIn(res, user)
    return { code: 200, message: "user activated syccessfully", accessToken }
  } catch (error) {
    console.log(error)
    throw `Error in signup service ${error.message}`
  }
}

// 1- check email and passwords sent
// 1.2- theck this user is active
// 2- check this user exists 
// 3- check password 
// 4- log the user in (tokens)
exports.loginService = async (data, res) => {
  try {
    const { email, password } = data
    if (!email || !password) {
      return { code: 400, message: 'Missed data!' }
    }
    let user = await userRepository.getUserByEmail(data.email)
    if (!user) {
      return { code: 404, message: 'wrong credential' }
    }
    if (!user.isVerified) {
      return { code: 404, message: 'user is not active' }
    }
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatch) {
    //   return { code: 404, message: 'wrong credential' }
    // }
    console.log(logUserIn, typeof logUserIn)
    const { accessToken, refreshToken } = logUserIn(res, user)
    console.log(refreshToken)
    return { code: 200, message: "user activated syccessfully", accessToken }
  } catch (error) {
    console.log(error)
    throw `Error in loginService service ${error.message}`
  }
}

exports.refreshTokenService = async (data, req) => {
  try {
    let refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return { code: 400, message: "There is no refreshToken in cookie" }
    }
    let user;
    try {
      // Verify that the refresh token is valid and has not been tampered with.
      user = await promisify(jwt.verify)(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      throw `Error in refreshTokenService service ${err.message}`
    }
    const accessToken = generateToken.generateAccessToken(user)
    return { code: 200, accessToken }

  } catch (error) {
    console.log(error)
    throw `Error in refreshTokenService service ${error.message}`
  }
}

exports.getUserService = async (userId) => {
  try {
    const user = await userRepository.getUserById(userId)
    console.log(userId, user)
    if (!user) {
      return { code: 404, message: "User not found!" }
    }
    else {
      return { code: 200, message: "User Retrieved Successfully", data: user }
    }
  } catch (error) {
    throw `Error in getUserService service ${error.message}`
  }
}

exports.updateUserService = async (userId, data) => {
  try {
    const user = await userRepository.updateUser(userId, data)
    console.log(userId, user)
    if (!user) {
      return { code: 404, message: "User not found!" }
    }
    else {
      return { code: 200, message: "User Updated Successfully" }
    }
  } catch (error) {
    throw `Error in getUserService service ${error.message}`
  }
}

exports.searchInUsers = async (userId, t) => {
  try {
    const users = await userRepository.getUsersByNameOrEmail(userId, t)
    users.sort((a, b) => (b.is_contact !== null) - (a.is_contact !== null));

    return { code: 200, users }

  } catch (error) {
    throw `Error in searchInUsers service ${error.message}`
  }
}

exports.uploadProfileImg = async (userId, data, file) => {
  try {
    if (!file) {
      return { code: 400, message: "There is no file uploaded" }
    }
    const profile_image = file.path
    const user = await userRepository.getUserById(userId)
    if (!user) {
      return { code: 404, message: "user not found" }
    }
    user.profile_image = profile_image
    await user.save()
    return { code: 200, message: "image uploaded successfully", data: { profile_image } }

  } catch (error) {
    throw `Error in searchInUsers service ${error.message}`
  }
}

exports.getuserCurrentStatus = async (userId) => {
  try {
    const userStatus = await userRepository.getuserCurrentStatus(userId)
    if (!userStatus){
      return {code: 404, message: "user not found!"}
    }
    return {code: 200, data: userStatus}
  } catch (error) {
    throw `Error in searchInUsers service ${error.message}`
  }
}