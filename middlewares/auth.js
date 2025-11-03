const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const adminAuth = (req, res, next) => {
  // say token is coming from cookie or localStorage of browser
  console.log(">>>>>>>>>> Admin Auth is called");
  const token = "adminKaChoda";
  const isAdmin = token === "adminKaChoda";
  if (isAdmin) {
    next();
  } else {
    res.status(401).send("You are not authorized for this request.");
  }
};

const userAuth = async (req, res, next) => {
  console.log("User Auth called >>>>>>>>>");
  const { token } = req.cookies;
  // console.log("Token inside userAuth >>>>>", token);
  if (!token) {
    res.status(401).send("You are not authorized !!");
  }

  const decodedMessage = jwt.verify(token, "Asdf#@21@#ASD");
  // console.log("Decoded message >>>", decodedMessage);
  const { userId } = decodedMessage;
  const user = await User.findById(userId).select("-password");

  req.user = user;

  next();
};

module.exports = {
  adminAuth,
  userAuth,
};
