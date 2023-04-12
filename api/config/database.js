require("dotenv").config();
const mongoose = require("mongoose");

const MongoConnect = () => {
  mongoose.connect(process.env.MONGODB);
  const db = mongoose.connection;
  db.on("error", (err) => {
    console.log("Database Connection Error: " + err.message);
  });
  db.once("connected", () => {
    console.log("Database Connected");
  });
};

module.exports = MongoConnect;
