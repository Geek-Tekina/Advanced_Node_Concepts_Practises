const logger = (req, res, next) => {
  const timeStamps = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const agent = req.get("User-agent");
  console.log(`[${timeStamps}] ${method} ${url} ${agent}`);
  next();
};
module.exports = logger;
