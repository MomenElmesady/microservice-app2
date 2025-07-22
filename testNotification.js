// /**
//  * sendPush.js
//  * One‑shot script that sends an FCM notification when you run:
//  *    node sendPush.js
//  * ------------------------------------------------------------
//  */

// const admin = require('firebase-admin');
// const path = require('path');

// // 1️⃣  Load the service‑account key
// const serviceAccountPath = path.join(__dirname, 'whatsapp-798cb-firebase-adminsdk-fbsvc-60a9a7f5aa.json');
// const serviceAccount     = require('./notification-service/whatsapp-798cb-firebase-adminsdk-fbsvc-60a9a7f5aa.json');

// // 2️⃣  Initialise Firebase Admin **with the key**
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // 3️⃣  🔧  Hard‑code a real device token (grab it from your mobile app)
// const TEST_DEVICE_TOKEN = 'fAPNbbUDRvCtBdJEbE_WsQ:APA91bG_S-3C1wCBCZXGU31H2PseYV_ADPHBqTeZHAn0svFZic58kki_Jevalsw8M45FZJUnrHU55-m7Z2JfHNwcsHpaC8kTvi5aoM_7UTp4AKYT5w8Urx0';   // ← replace me!

// // 4️⃣  Dummy message payload
// const dummyMessage = {
//   content   : '🚀 Hello from sendPush.js',
//   messageId : 'msg‑123',
//   senderId  : 'user‑42',
// };

// // 5️⃣  Send function (your original logic, tweaked)
// async function sendPushNotification(token, message) {
//   const payload = {
//     notification: {
//       title: 'New Message',
//       body : message.content,
//     },
//     data: {
//       messageId: message.messageId,
//       senderId : message.senderId,
//     },
//     token,
//   };

//   try {
//     const response = await admin.messaging().send(payload);
//     console.log('✅  Successfully sent message:', response);
//   } catch (err) {
//     console.error('❌  Error sending notification:', err);
//   }
// }

// // 6️⃣  Kick it off, then exit
// sendPushNotification(TEST_DEVICE_TOKEN, dummyMessage).then(() => process.exit());

const User = require("./user-service/models/user.model");
const Message = require("./user-service/models/message.model");

async function getMessageData(messageId) {
  return await Message.findOne({
    where: { id: messageId },
    attributes: ['id', 'content', 'createdAt', 'media_url', 'chat_id'],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'profileImg'],
      }
    ],
  });
}

// ✅ Wrap in async function
async function main() {
  try {
    const message = await getMessageData(1);
    console.log(JSON.stringify(message, null, 2));
  } catch (error) {
    console.error("❌ Error fetching message data:", error);
  }
}

main();