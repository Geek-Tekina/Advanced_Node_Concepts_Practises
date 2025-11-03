const rateLimit = require("express-rate-limit");

// maxRequests per time minutes, ex : 100 req / 15 min (per 15 minutes, 100 requests are allowed )
const createBasicRateLimiter = (maxRequests, time) => {
  return rateLimit({
    max: maxRequests,
    windowMs: time,
    message: "Too many requests, Try again later.",
    standardHeaders: true,
  });
};

module.exports = createBasicRateLimiter;
