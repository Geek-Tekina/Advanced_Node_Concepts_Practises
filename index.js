const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const { dbConnect } = require("./database/connection");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { configureCors } = require("./config/corsConfig");
const logger = require("./middlewares/logger");
const createBasicRateLimiter = require("./middlewares/rateLimmiting");

const app = express();

app.use(configureCors());
app.use(cookieParser());
app.use(createBasicRateLimiter(100, 15 * 60 * 1000)); // 100 req per 15 mintues
app.use(express.json()); // without this capturing the req.body will not work

app.get("/stream", (req, res) => {
  const file = fs.readFileSync("./interstellar.txt");
  res.end(file);
  const readStream = fs.createReadStream("./interstellar.txt", {
    encoding: "utf-8",
  });

  readStream.pipe(res);

  // readStream.on("data", (chunk) => {
  //   console.log(chunk);
  //   res.write(chunk);
  // });

  // readStream.on("end", () => {
  //   res.end();
  // });

  // readStream.on("error", (err) => {
  //   console.log("Error reading file:", err);
  //   res.status(500).send("Error reading file");
  // });
});

// ------------------------ These routes are only for admin ---------------------------------

app.use("/admin", adminAuth);

app.get("/admin/getData", logger, (req, res) => {
  try {
    const data = {
      amount: 234560,
      company: "TCS",
    };
    res.json(data);
  } catch (err) {
    console.log("Error in /admin/getData \n", err.message);
    throw err;
  }
});

app.post("/admin/postData", (req, res) => {
  try {
    const data = req.body;
    console.log("Data >>>>>>>>>>>>>>", data);
    res.send("Successfully got Data.");
  } catch (err) {
    console.log("Error in /admin/postData ", err.message);
    throw err;
  }
});

// ------------------------ These routes are only for admin ---------------------------------

// ------------------------ Routes for User -------------------------------------------------

app.post("/user/signUp", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const pwd = await bcrypt.hash(password, 10);
    // console.log("Hashed password is >>>>>>>>", pwd);

    const newUser = await new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: pwd,
    });

    await newUser.save();
    res.status(201).send("User created successfully !!");
  } catch (err) {
    console.log("Error in /user/signUp ", err.message);
    throw err;
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ifUserExists = await User.findOne({ email: email });
    // console.log("ifUserExists >>>>", ifUserExists);
    if (!ifUserExists) {
      res.status(404).send("Credentials are not right !!");
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      ifUserExists.password
    );
    if (!isPasswordMatch) {
      res.status(404).send("Credentials are not right !!");
    }

    const id = ifUserExists._id;
    const token = await jwt.sign({ userId: id }, "Asdf#@21@#ASD");
    // console.log("Token >>>>>>>", token);

    res.cookie("token", token);

    res.status(200).send(`User Logged in !! Hello ${ifUserExists.firstName} `);
  } catch (err) {
    console.log("error in /user/login", err.message);
    throw err;
  }
});

app.get("/user/getMe", userAuth, async (req, res) => {
  const user = req.user;
  res.status(200).send(user);
});

// ------------------------ Routes for User -------------------------------------------------

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong.");
  }
});

// dbConnect();
app.listen(4000, () => {
  console.log(`Server running on 4000`);
});
