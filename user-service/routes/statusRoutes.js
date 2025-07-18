const express = require('express');
const userController = require("../controllers/userController")
const statusController = require("../controllers/statusController")
const router = express.Router();
const { uploadStory } = require("../config/cloudinaryStorage")

router.get("/getUserCotactsStatus", userController.protect, statusController.getUserCotactsStatus)

router.post("/", userController.protect, uploadStory.single("image"), statusController.createStatus) // handle images
router.delete("/:statusId", userController.protect, statusController.deleteStatus)
// router.put("/", userController.protect, statusController.editStatus)
router.post("/view/:statusId", userController.protect, statusController.viewStatus)
router.post("/react/:statusId", userController.protect, statusController.reactStatus)

router.get("/views/:statusId", userController.protect, statusController.getStatusViews)
router.get("/reacts/:statusId", userController.protect, statusController.getStatusReacts)

// get current user statuses
router.get("/", userController.protect, statusController.getCurrentUserStatuses)

module.exports = router