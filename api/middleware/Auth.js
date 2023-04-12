require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenVerification = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.json({ msg: "Token Required", status: 403 });
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.json({ msg: "Invalid Token", status: 401 });
    req.userId = user.userId;
    next();
  });
};

module.exports = tokenVerification;