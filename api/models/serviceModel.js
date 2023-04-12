const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ServiceModel = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    images: String,
    userId: Schema.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports = mongoose.model("services", ServiceModel);
