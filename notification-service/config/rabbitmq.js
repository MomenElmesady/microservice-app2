const amqp = require('amqplib');

async function connectRabbitMQ(retries = 10, delay = 5000) {
  const rabbitHost = process.env.RABBITMQ_HOST || 'rabbitmq';
  const url = `amqp://${rabbitHost}:5672`;
  let connection;

  while (retries > 0) {
    try {
      console.log(`🔁 Trying to connect to RabbitMQ at ${url}`);
      connection = await amqp.connect(url);
      console.log("✅ Connected to RabbitMQ");
      return connection;
    } catch (err) {
      retries--;
      console.error(`❌ RabbitMQ connection failed. Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error("🚫 Could not connect to RabbitMQ after multiple attempts");
}

module.exports = { connectRabbitMQ };
