const statusRepository = require("../repositories/statusRepository.js")
exports.getContactsStatusService = async (userId) => {
  try {
    let data = await statusRepository.getContactsStatus(userId);

    // Convert Sequelize model instances to plain JSON objects
    let plainData = JSON.parse(JSON.stringify(data));

    // Process `statuses` array: Replace `views` with `true` if not empty, `false` if empty
    plainData.contacts = plainData.contacts.map(contact => {
      contact.statuses = contact.statuses.map(status => {
        status.is_viewed = status.views.length > 0; // true if views exist, false otherwise
        status.is_reacted = status.reacts.length > 0; // true if views exist, false otherwise
        return status;
      });

      return contact;
    });
    const viewedContacts = [];
    const unviewedContacts = [];

    plainData.contacts.forEach(contact => {
      // Check if all statuses have `views = true`
      const allViewed = contact.statuses.every(status => status.views === true);

      if (allViewed) {
        viewedContacts.push(contact);
      } else {
        unviewedContacts.push(contact);
      }
    });

    return { code: 200, viewedContacts, unviewedContacts };
  } catch (error) {
    console.log(error);
    throw `Error in getContactsStatusService service: ${error.message}`;
  }
};

exports.getCurrentUserStatuses = async (userId) => {
  try {
    let data = await statusRepository.getCurrentUserStatuses(userId);
    

    return { code: 200, data };
    // return { code: 200, data: plainData };
  } catch (error) {
    console.log(error);
    throw `Error in getCurrentUserStatuses service: ${error.message}`;
  }
};

// 1- get the status 
// 2- return not found if not 
// 3- check if the story belong the the user 
// 4- check if this read already exists 
exports.viewStatusService = async (userId, statusId) => {
  try {
    const status = await statusRepository.getStatusById(statusId)
    if (!status) {
      return { code: 404, message: "status not found" }
    }
    if (status.user_id == userId) {
      return { code: 400, message: "user cant read his story" }
    }
    const checkReadStatus = await statusRepository.checkViewStatus(statusId, userId)
    if (checkReadStatus) {
      return { code: 400, message: "user already read this" }
    }
    await statusRepository.viewStatus(statusId, userId)
    return { code: 200, message: "read successfully" }
  } catch (error) {
    console.log(error)
    throw `Error in viewStatusService service ${error.message}`
  }
}
exports.reactStatusService = async (userId, statusId) => {
  try {
    const status = await statusRepository.getStatusById(statusId)
    if (!status) {
      return { code: 404, message: "status not found" }
    }
    if (status.user_id == userId) {
      return { code: 400, message: "user cant react his story" }
    }
    const checkReadStatus = await statusRepository.checkReactStatus(statusId, userId)
    if (checkReadStatus) {
      return { code: 400, message: "user already love this" }
    }
    await statusRepository.reactStatus(statusId, userId)
    return { code: 200, message: "loved successfully" }
  } catch (error) {
    console.log(error)
    throw `Error in getContactsStatusService service ${error.message}`
  }
}
exports.getStatusViewsService = async (userId, statusId) => {
  try {
    const status = await statusRepository.getStatusById(statusId)
    if (!status) {
      return { code: 404, message: "status not found" }
    }
    if (status.user_id != userId) {
      return { code: 400, message: "this story dont belong to this user" }
    }
    const data = await statusRepository.getStatusViews(statusId, userId)

    return { code: 200, message: "views retrieved successfully", data }
  } catch (error) {
    console.log(error)
    throw `Error in getStatusViewsService service ${error.message}`
  }
}
exports.getStatusReactsService = async (userId, statusId) => {
  try {
    const status = await statusRepository.getStatusById(statusId)
    if (!status) {
      return { code: 404, message: "status not found" }
    }
    if (status.user_id != userId) {
      return { code: 400, message: "this story dont belong to this user" }
    }
    const data = await statusRepository.getStatusReacts(statusId, userId)

    return { code: 200, message: "reacts retrieved successfully", data }
  } catch (error) {
    console.log(error)
    throw `Error in getStatusReactsService service ${error.message}`
  }
}


exports.createStatus = async (userId, data, file) => {
  try {
    const { content } = data;
    const imageUrl = file ? file.path : null; // Get image if uploaded
    if (!content && !imageUrl) {
      return { code: 400, message: "cant create empty status" }
    }
    const statusObj = {
      user_id: userId,
      content,
      media_url: imageUrl,
      expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // Set expiration time (24 hours)
    }
    // Save story in database
    const newStory = await statusRepository.createStatus(statusObj)
    return { code: 200, newStory }
  } catch (error) {
    console.log(error)
    throw `Error in createStatus service ${error.message}`
  }
}

// check if status found and belongs to this user 
exports.deleteStatus = async (userId, statusId) => {
  try {
    const status = await statusRepository.getStatusById(statusId)
    if (!status) {
      return { code: 404, message: "status not found" }
    }
    if (status.user_id != userId) {
      return { code: 403, message: "status not belong to current user" }
    }
    await statusRepository.deleteStatus(statusId)
    return { code: 202, message: "status deleted successfully" }
  } catch (error) {
    console.log(error)
    throw `Error in deleteStatus service ${error.message}`
  }
}