const User = require("../models/user.model")
const Contact = require("../models/contact.model")
const Status = require("../models/status.model")
const StatusView = require("../models/statusViews.model")
const StatusReact = require("../models/statusReacts.model")
const { Op } = require("sequelize");

exports.getContactsStatus = async (userId) => {
  try {
    return await User.findOne({
      where: { id: userId },
      attributes: [["id", "current_user_id"]],
      include: [
        {
          model: User,
          as: "contacts",
          attributes: ["id", "name", "profile_image"],
          through: { attributes: [], where: { is_mutual: true } }, // Prevents returning the Contact table data
          include: [
            {
              model: Status,
              as: "statuses",
              attributes: ["id", "content", "media_url", "isActive", "expired_at", "createdAt"],
              order: ["createdAt"],
              required: true,
              where: {
                expired_at: { [Op.gt]: new Date() } // Filters only statuses where expired_at is less than NOW()
              },
              include: [
                {
                  model: StatusView,
                  as: "views",
                  attributes: ["id"],
                  where: { user_id: userId },
                  required: false, // Ensures contacts without views are still included
                  order: ['createdAt']
                },
                {
                  model: StatusReact,
                  as: "reacts",
                  attributes: ["id"],
                  where: { user_id: userId },
                  required: false, // Ensures contacts without views are still included
                  order: ['createdAt']
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.log(error);
    throw `Error in getContactsStatus repository ${error.message}`;
  }
};

exports.getCurrentUserStatuses = async (userId) => {
  try {
    return await Status.findAll({
      where: {
        user_id: userId,
        expired_at: { [Op.gt]: new Date() } // Filters only statuses where expired_at is less than NOW() 
        
      },include: [
        {
          model: StatusView,
          as: "views",
          attributes: ['id', 'createdAt'],
          include: [
            {
              model: User,
              as: "user",
              attributes: ['id','name', 'profile_image','email']
            }
          ]
        },
        {
          model: StatusReact,
          as: "reacts",
          attributes: ['id', 'createdAt'],
          include: [
            {
              model: User,
              as: "user",
              attributes: ['id','name', 'profile_image','email']
            }
          ]
        }
      ]
    })
  } catch (error) {
    console.log(error);
    throw `Error in getContactsStatus repository ${error.message}`;
  }
};


exports.getStatusById = async (statusId) => {
  try {
    return await Status.findByPk(statusId)
  } catch (error) {
    console.log(error)
    throw `Error in getStatusById repository ${error.message}`
  }
}

exports.checkViewStatus = async (statusId, userId) => {
  try {
    return await StatusView.findOne({ where: { status_id: statusId, user_id: userId } })
  } catch (error) {
    console.log(error)
    throw `Error in getStatusById repository ${error.message}`
  }
}

exports.viewStatus = async (statusId, userId) => {
  try {
    return await StatusView.create({ status_id: statusId, user_id: userId })
  } catch (error) {
    console.log(error)
    throw `Error in getStatusById repository ${error.message}`
  }
}
exports.deleteStatus = async (statusId) => {
  try {
    return await Status.destroy({ where: { id: statusId } })
  } catch (error) {
    console.log(error)
    throw `Error in deleteStatus repository ${error.message}`
  }
}

exports.checkReactStatus = async (statusId, userId) => {
  try {
    return await StatusReact.findOne({ where: { status_id: statusId, user_id: userId } })
  } catch (error) {
    console.log(error)
    throw `Error in getStatusById repository ${error.message}`
  }
}

exports.reactStatus = async (statusId, userId) => {
  try {
    return await StatusReact.create({ status_id: statusId, user_id: userId })
  } catch (error) {
    console.log(error)
    throw `Error in getStatusById repository ${error.message}`
  }
}

exports.getStatusViews = async (statusId, userId) => {
  try {
    return await StatusView.findAll({
      where: { status_id: statusId },
      include: [{
        model: User,
        as: "user"
      }]
    })
  } catch (error) {
    console.log(error)
    throw `Error in getStatusById repository ${error.message}`
  }
}

exports.getStatusReacts = async (statusId, userId) => {
  try {
    return await StatusReact.findAll({
      where: { status_id: statusId },
      include: [{
        model: User,
        as: "user"
      }]
    })
  } catch (error) {
    console.log(error)
    throw `Error in getStatusById repository ${error.message}`
  }
}

exports.createStatus = async (statusObj) => {
  try {
    return await Status.create(statusObj)
  } catch (error) {
    console.log(error)
    throw `Error in createStatus repository ${error.message}`
  }
}