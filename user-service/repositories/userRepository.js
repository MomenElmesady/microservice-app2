const User = require("../models/user.model")
const UserStatus = require("../models/userStatus.model")
const { Op } = require("sequelize");
const sequelize = require("../config/database")


exports.getUserByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } })
  } catch (error) {
    throw `Error in getUserByEmail repository ${error.message}`
  }
}
exports.getuserCurrentStatus = async (userId) => {
  try {
    return await UserStatus.findOne({ where: { user_id: userId } })
  } catch (error) {
    throw `Error in getuserCurrentStatus repository ${error.message}`
  }
}
exports.getUserByNumber = async (phone_number) => {
  try {
    return await User.findOne({ where: { phone_number } })
  } catch (error) {
    throw `Error in getUserByEmail repository ${error.message}`
  }
}

exports.createUser = async (userData) => {
  try {
    return await User.create(userData)
  } catch (error) {
    console.log(error)
    throw `Error in craete user repository ${error.message}`
  }
}

exports.getUserById = async (userId) => {
  try {
    return await User.findByPk(userId, {
      attributes: [
        "id",
        "name",
        "phone_number",
        "discription",
        "email",
        "profile_image"
      ]
    })

  } catch (error) {
    console.log(error)
    throw `Error in get user repository ${error.message}`
  }
}

exports.updateUser = async (userId, data) => {
  try {
    return await User.update(data, {
      where: {
        id: userId
      }
    })
  } catch (error) {
    console.log(error)
    throw `Error in updateUser repository ${error.message}`
  }
}
exports.getUsersByNameOrEmail = async (userId, t) => {

  try {
    const result = await sequelize.query(
      `SELECT u.name, u.email, u.profile_image, u.discription, u.id as userId, c.contact_id as is_contact
       FROM users u 
       LEFT JOIN contacts c ON c.user_id = :userId AND c.contact_id = u.id 
       WHERE (u.name LIKE :search) 
       AND u.id != :userId`,
      {
        replacements: { userId, search: `%${t}%` },
        type: sequelize.QueryTypes.SELECT
      }
    );
    return result
  } catch (error) {
    console.log(error)
    throw `Error in getUsersByNameOrEmail repository ${error.message}`
  }
}

