const contactRepository = require("../repositories/contactRepository")
// 1- check if the mutual exists 
// 2- if yes add new one with value 1 and update the other
// 2- else add new one with value 0
exports.createContactService = async (userId, contactId) => {
  try {
    if (userId == contactId){
      return {code: 400, message: "user cand add himself"}
    }
    const reverseContact = await contactRepository.checkMutual(userId, contactId)
    let is_mutual = false
    if (reverseContact) {
      is_mutual = true
      reverseContact.is_mutual = true
    }
    await contactRepository.createContact(userId, contactId, is_mutual)
    if (reverseContact) {
      await reverseContact.save()
    }
    return { code: 200, message: "contact created successfully" }

  } catch (error) {
    console.log(error)
    throw `Error in createContact service ${error.message}`
  }
}

exports.getUserContacts = async (userId) => {
  try {
    const users = await contactRepository.getUserContacts(userId)
    return { code: 200, users }

  } catch (error) {
    console.log(error)
    throw `Error in getUserContacts service ${error.message}`
  }
}