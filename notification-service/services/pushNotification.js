const { admin } = require("../config/fcmConfig")

async function sendPushNotification(token, message) {
  try {
const messagePayload = {
  notification: {
    title: 'New Message',
    body: message.content.content, // ✅ لازم تكون String
  },
  data: {
    messageId: String(message.messageId), // ✅ String
    senderId: String(message.senderId),   // ✅ String
    chatId: String(message.content.chat_id),  // ✅ String
    userName: message.content.user?.name || 'Unknown User', // ✅ String
    profileImg: message.content.user?.profile_image || '',   // ✅ String
    mediaUrl: message.content.media_url || ''                // ✅ String
  },
  token: token // ✅ FCM token كـ string
};

  console.log('Sending push notification with payload:2', messagePayload);

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