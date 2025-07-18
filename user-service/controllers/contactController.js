const contactService = require("../services/contact.service.js")

exports.createContact = async (req, res) => {
  try {
    const userId = req.userId 
    const contactId = req.params.contactId
    const response = await contactService.createContactService(userId,contactId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getUserContacts = async(req,res,next) => {
  try {
    const userId = req.userId 
    const response = await contactService.getUserContacts(userId)
    res.status(response.code).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}