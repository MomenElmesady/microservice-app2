const express = require('express');
const userController = require("../controllers/userController")
const router = express.Router();

// Define routes
router.post('/signup', userController.signUp);
router.post('/resendOTP', userController.resendOTP);
router.post('/verifyOTP', userController.verifyOTP);
router.post('/login', userController.login) ;
router.get('/refreshToken', userController.refreshToken) ;
// router.get('/protect', userController.protect) ;
// router.post("/forgotPassword", userController.forgotPassword)
// router.patch("/resetPassword/:token", userController.resetPassword)
module.exports = router
