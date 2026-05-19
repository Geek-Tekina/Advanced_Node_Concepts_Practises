const amqp = require("amqplib");

const receiveMessages = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";
    const queue = "payment_queue";

    await channel.assertExchange(exchange, "topic", {
      durable: true,
    });

    await channel.assertQueue(queue, {
      durable: true,
    });

    // Listen to all payment related events
    await channel.bindQueue(queue, exchange, "payment.*");

    console.log("Waiting for payment notifications...");

    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(
            `[Payment Notification] Routing Key: ${msg.fields.routingKey}`
          );

          console.log(
            `[Payment Notification] Message: ${msg.content.toString()}`
          );

          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

receiveMessages();
