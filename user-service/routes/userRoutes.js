const express = require('express');
const userController = require("../controllers/userController")
const { uploadProfile } = require("../config/cloudinaryStorage")
const router = express.Router();

router.get("/",userController.protect,userController.getUser)
router.put("/",userController.protect,userController.editUser)
router.get("/search",userController.protect,userController.searchInUsers)
router.get("/currentStatus",userController.protect,userController.getuserCurrentStatus)
router.post("/image",userController.protect,uploadProfile.single("image"),userController.uploadProfileImg)

router.post('/api/register-fcm-token', userController.registerFCMToken);

module.exports = router