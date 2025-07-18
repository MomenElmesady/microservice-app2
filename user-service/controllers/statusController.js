const statusService = require("../services/status.service.js")

exports.createStatus = async (req, res, next) => {
  try {
    const userId = req.userId
    const data = req.body
    const response = await statusService.createStatus(userId, data, req.file)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getUserCotactsStatus = async (req, res) => {
  try {
    const userId = req.userId
    const response = await statusService.getContactsStatusService(userId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
exports.getCurrentUserStatuses = async (req, res) => {
  try {
    const userId = req.userId
    const response = await statusService.getCurrentUserStatuses(userId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.viewStatus = async (req, res, next) => {
  try {
    const userId = req.userId
    const statusId = req.params.statusId
    const response = await statusService.viewStatusService(userId, statusId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.reactStatus = async (req, res, next) => {
  try {
    const userId = req.userId
    const statusId = req.params.statusId
    const response = await statusService.reactStatusService(userId, statusId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.reactStatus = async (req, res, next) => {
  try {
    const userId = req.userId
    const statusId = req.params.statusId
    const response = await statusService.reactStatusService(userId, statusId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getStatusViews = async (req, res, next) => {
  try {
    const userId = req.userId
    const statusId = req.params.statusId
    const response = await statusService.getStatusViewsService(userId, statusId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getStatusReacts = async (req, res, next) => {
  try {
    const userId = req.userId
    const statusId = req.params.statusId
    const response = await statusService.getStatusReactsService(userId, statusId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
exports.deleteStatus = async (req, res, next) => {
  try {
    const userId = req.userId
    const statusId = req.params.statusId
    const response = await statusService.deleteStatus(userId, statusId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}