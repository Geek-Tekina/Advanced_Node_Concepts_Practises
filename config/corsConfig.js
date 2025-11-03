const cors = require("cors");

const configureCors = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:4000"];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // this means giving permission to request the server
      } else {
        callback(new Error("CORS Error : Origin not allowed."));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    exposedHeaders: ["X-Total-Count", "Content-Range"],
    credentials: true, // enables support for cookies and authorization header
    maxAge: 600, //it catches the result of preflight request for 600 seconds
  });
};

module.exports = { configureCors };
