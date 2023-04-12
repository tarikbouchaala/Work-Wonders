const Testimonial = require("../models/testimonialModel");
const Service = require("../models/serviceModel");
const Order = require("../models/orderModel");
const { findUserById } = require("./UserController");

const getServiceRating = async (serviceId) => {
  const serviceExists = await Service.findById(serviceId);
  if (serviceExists) {
    const serviceRating = await Testimonial.find({
      serviceId,
    });
    if (serviceRating.length != 0) {
      if (serviceRating.length > 1) {
        let sumRating = 0;
        for (let i of serviceRating) {
          sumRating += parseInt(i.rating);
        }
        return (sumRating / serviceRating.length).toFixed(1);
      }
      return serviceRating[0].rating;
    }
    return 0;
  }
  return "Service doesn't exists";
};

const createTestimonial = async (clientId, orderId, body) => {
  const userExists = await findUserById(clientId);
  if (userExists) {
    const serviceExists = await Order.findById(orderId);
    if (serviceExists) {
      if (userExists.role != "client") {
        return "You Don't Have Permission";
      }
      const createdTestimonial = await Testimonial.create({
        clientId,
        serviceId: serviceExists.serviceId,
        text: body.text,
        rating: body.rating,
      });
      return "Testimonial saved successfully";
    }
    return "Service doesn't exists";
  }
  return "User doesn't exists";
};

module.exports = {
  getServiceRating,
  createTestimonial,
};
