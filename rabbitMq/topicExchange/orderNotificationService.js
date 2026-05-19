const amqp = require("amqplib");

const receiveMessages = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";
    const queue = "order_queue";

    await channel.assertExchange(exchange, "topic", {
      durable: true,
    });

    await channel.assertQueue(queue, {
      durable: true,
    });

    // Listen to all order related events
    await channel.bindQueue(queue, exchange, "order.*");

    console.log("Waiting for order notifications...");

    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(
            `[Order Notification] Routing Key: ${msg.fields.routingKey}`
          );

          console.log(
            `[Order Notification] Message: ${msg.content.toString()}`
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
