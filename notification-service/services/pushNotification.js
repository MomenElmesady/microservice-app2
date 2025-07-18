const { admin } = require("../config/fcmConfig")

async function sendPushNotification(token, message) {
  try {
    const messagePayload = {
      notification: {
        title: 'New Message',
        body: message.content,
      },
      data: {
        messageId: message.messageId,
        senderId: message.senderId,
      },
      token: token,
    };

    // Send notification via FCM
    const response = await admin.messaging().send(messagePayload);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

module.exports = { sendPushNotification }