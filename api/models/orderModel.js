const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const OrderModel = new Schema(
  {
    clientId: Schema.Types.ObjectId,
    serviceId: Schema.Types.ObjectId,
    status: { type: String, default: "OnGoing" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderModel);
