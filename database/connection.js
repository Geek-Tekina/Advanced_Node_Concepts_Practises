const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tpbc1717_db_user:cHvmgGnJ0VEaeCL4@cluster0.j7gkqmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to Database !!");
  } catch (err) {
    console.log("Error connecting to db !!", err);
  }
};

module.exports = {
  dbConnect,
};
