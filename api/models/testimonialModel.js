const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const TestimonialModel = new Schema(
  {
    clientId: Schema.Types.ObjectId,
    serviceId: Schema.Types.ObjectId,
    text: String,
    rating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("testimonials", TestimonialModel);
