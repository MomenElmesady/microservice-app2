
const User = require("../models/user.model")
const { sendPushNotification } = require("./pushNotification")
const queue = 'notification.new_message';
const { connectRabbitMQ } = require("../config/rabbitmq");

// RabbitMQ consumer to listen for new message notifications
async function listenForNewMessages() {
  try {

    console.log("Starting RabbitMQ consumer for new messages...");
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
  
    await channel.assertQueue(queue, { durable: true });
  
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
    channel.consume(queue, async (msg) => {
      
      const messageData = JSON.parse(msg.content.toString());
      console.log('Received message:', messageData);
  
      // Call function to send push notification to the user
      try {
        const token = await getUserFCMToken(1);
        console.log(token)
        if (token) {
          await sendPushNotification(token, messageData);
        }
      } catch (error) {
        console.error('Error sending notification', error);
      }
  
      channel.ack(msg);
    });
  } catch(error){
    console.log(error,"errrrrr")
  }
}

// Function to fetch the receiver's FCM token (you can implement this to query your database)
async function getUserFCMToken(userId) {
  try {
    // Replace this with the actual logic to fetch FCM token from DB
    const user = await User.findByPk(userId)
    return user?.fcm_token
  } catch (e) {
    console.log(e)
  }
}

module.exports = { listenForNewMessages }