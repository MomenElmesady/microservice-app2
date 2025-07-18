const express = require('express');
const userController = require("../controllers/userController")
const contactController = require("../controllers/contactController")
const router = express.Router();

router.post("/:contactId", userController.protect, contactController.createContact)
router.get("/", userController.protect, contactController.getUserContacts)

module.exports = router