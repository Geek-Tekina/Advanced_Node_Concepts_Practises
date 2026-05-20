const amqp = require("amqplib");

const sendMessage = async (message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, {
      durable: true,
    });

    // In fanout exchange, routing key is ignored
    channel.publish(exchange, "", Buffer.from(JSON.stringify(message)));

    console.log(`[x] Sent: ${JSON.stringify(message)}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Message
sendMessage({
  productId: 101,
  name: "iPhone 17 Pro",
  price: 150000,
});
