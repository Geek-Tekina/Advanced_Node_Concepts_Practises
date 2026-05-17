const amqp = require("amqplib");

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertQueue("mail_queue", {
      durable: true,
    });

    channel.consume("mail_queue", (message) => {
      if (message !== null) {
        console.log("Message from queue", JSON.parse(message.content));
        channel.ack(message);
      }
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

sendMail();
