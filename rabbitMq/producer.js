const amqp = require("amqplib");

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchangeName = "mail_exchange";
    const routingKey = "send_mail";

    const message = {
      to: "hemant1717@gmail.com",
      from: "aniket@gmail.com",
      subject: "Time Pass Mail",
      mail: "Hi Hemant, how are you ?",
    };

    await channel.assertExchange(exchangeName, "direct", {
      durable: false,
    });

    await channel.assertQueue("mail_queue", {
      durable: true,
    });

    await channel.bindQueue("mail_queue", exchangeName, routingKey);

    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );

    console.log("Message Published");

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

sendMail();
