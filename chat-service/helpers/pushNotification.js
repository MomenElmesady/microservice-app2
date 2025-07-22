const amqp = require('amqplib');

async function publishNotification(messageObj, retries = 5, delay = 5000) {
  let connection;
  console.log("123456654321")
  const rabbitHost = process.env.RABBITMQ_HOST || 'rabbitmq';
  const url = `amqp://${rabbitHost}:5672`;
  const queue = 'notification.new_message';

  while (retries > 0) {
    try {
      console.log(`📤 Trying to connect to RabbitMQ at ${url}`);
      connection = await amqp.connect(url);
      const channel = await connection.createChannel();

      console.log(`📦 Asserting queue: ${queue}`);
      await channel.assertQueue(queue, { durable: true });

      console.log("🚚 Sending message:", messageObj);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageObj)), {
        persistent: true,
      });

      console.log('✅ Message sent to notification queue');

      await channel.close();
      break;
    } catch (err) {
      retries--;
      console.error(`❌ Failed to send message. Retries left: ${retries}`);
      console.error("❌ Error:", err);

      if (retries === 0) {
        console.error("🚫 Could not publish message after multiple attempts");
        break;
      }

      await new Promise(res => setTimeout(res, delay));
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (e) {
          console.error("⚠️ Error closing RabbitMQ connection:", e.message);
        }
      }
    }
  }
}

module.exports = { publishNotification };