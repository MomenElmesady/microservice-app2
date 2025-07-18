const Contact = require("../models/contact.model")
const User = require("../models/user.model")
exports.checkMutual = async (userId, contactId) => {
  try {
    // reverse userId with contactId to check reverse
    return await Contact.findOne({ where: { user_id: contactId, contact_id: userId } })
  } catch (error) {
    console.log(error)
    throw `Error in checkMutual repository ${error.message}`
  }
}
exports.createContact = async (userId, contactId, is_mutual) => {
  try {
    console.log(userId, contactId)
    return await Contact.create({ user_id: userId, contact_id: contactId, is_mutual })
  } catch (error) {
    console.log(error)
    throw `Error in createContact repository ${error.message}`
  }
}

exports.getUserContacts = async (userId) => {
  try {
    return await User.findOne({
      where: { id: userId },
      attributes: [["id", "current_user_id"]],
      include: [
        {
          model: User,
          as: "contacts",
          attributes: ["id", "name", "profile_image","email","discription"],
          through: { attributes: [] }, // Prevents returning the Contact table data
        },
      ],
    });
  } catch (error) {
    console.log(error)
    throw `Error in getUserContacts repository ${error.message}`
  }
}