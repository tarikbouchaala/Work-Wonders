const User = require("../models/UserModel");
const Order = require("../models/orderModel");
const Service = require("../models/serviceModel");
const Testimonial = require("../models/testimonialModel");
const { getServiceRating } = require("./TestimonialsController");

const freelancerDashboard = async (userId) => {
  const selectedFreelancer = await User.findById(userId);
  if (selectedFreelancer) {
    if (selectedFreelancer.role != "freelancer") {
      return "You Don't Have Permission";
    }

    let ordersNumber = 0;
    let freelancerRevenues = 0;
    let completedOrders = 0;

    const orders = await Order.find({ status: "Completed" });
    const allOrders = await Order.find();
    if (allOrders.length != 0) {
      for (let i of allOrders) {
        const selectedService = await Service.findById(i.serviceId);
        if (
          selectedService.userId.toString() == selectedFreelancer._id.toString()
        ) {
          ordersNumber++;
        }
      }
    }
    if (orders.length != 0) {
      for (let i of orders) {
        const selectedService = await Service.findById(i.serviceId);
        if (
          selectedService.userId.toString() == selectedFreelancer._id.toString()
        ) {
          completedOrders++;
          freelancerRevenues += selectedService.price;
        }
      }
    }

    let freelancerRating = 0;
    let freelancerTestimonials = [];

    const services = await Service.find({ userId: selectedFreelancer });
    if (services.length != 0) {
      // Rating
      let servicesNumber = 0;
      let sumServiceRating = 0;
      for (let i of services) {
        let selectedServiceRating = await getServiceRating(i._id);
        if (selectedServiceRating != 0) {
          servicesNumber++;
          sumServiceRating += parseFloat(selectedServiceRating);
        }
      }
      if (servicesNumber != 0) {
        freelancerRating = (sumServiceRating / servicesNumber).toFixed(1);
      }
      // Testimonials
      let freelancerServicesTestimonials = [];
      for (let i of services) {
        const serviceTestimonials = await Testimonial.find({
          serviceId: i._id,
        });
        freelancerServicesTestimonials.push(...serviceTestimonials);
      }
      for (let i of freelancerServicesTestimonials) {
        let cpt = 0;
        const clientInfo = await User.findById(i.clientId);

        if (freelancerTestimonials.length != 0) {
          for (let j of freelancerTestimonials) {
            if (i.clientId.toString() == j.clientId.toString()) {
              cpt++;
            }
          }

          if (cpt == 0) {
            freelancerTestimonials.push({
              ...i._doc,
              clientUsername: clientInfo.username,
              clientAvatar: clientInfo.image,
            });
          }
        } else {
          freelancerTestimonials.push({
            ...i._doc,
            clientUsername: clientInfo.username,
            clientAvatar: clientInfo.image,
          });
        }
      }
    }
    return {
      username: selectedFreelancer.username,
      revenues: freelancerRevenues,
      ordersNumber,
      completedOrders,
      rating: freelancerRating,
      testimonials: freelancerTestimonials,
    };
  }
  return "User doesn't exist";
};

const clientDashboard = async (userId) => {
  const selectedClient = await User.findById(userId);
  if (selectedClient) {
    if (selectedClient.role != "client") {
      return "You Don't Have Permission";
    }
    const orders = await Order.find({
      clientId: selectedClient._id,
    });
    const ordersMade = orders.length;
    let completedOrders = 0;
    let expenses = 0;
    if (orders.length != 0) {
      let servicesPriceSum = 0;
      for (let i of orders) {
        if (i.status == "Completed") {
          completedOrders++;
          const selectedService = await Service.findById(i.serviceId);
          servicesPriceSum += parseFloat(selectedService.price);
        }
      }
      expenses = servicesPriceSum.toFixed(2);
    }
    const testimonialsMade = [];
    const clientTestimonials = await Testimonial.find({
      clientId: selectedClient._id,
    });
    if (clientTestimonials.length > 0) {
      for (let i of clientTestimonials) {
        const serviceUserId = (await Service.findById(i.serviceId)).userId;
        const userInfo = await User.findById(serviceUserId);
        if (testimonialsMade.length != 0) {
          let cpt = 0;
          for (let j of testimonialsMade) {
            if (j.freelancerUsername == userInfo.username) {
              cpt++;
            }
          }
          if (cpt == 0) {
            testimonialsMade.push({
              testimonialText: i.text,
              freelancerUsername: userInfo.username,
              freelancerAvatar: userInfo.image,
            });
          }
        } else {
          testimonialsMade.push({
            testimonialText: i.text,
            freelancerUsername: userInfo.username,
            freelancerAvatar: userInfo.image,
          });
        }
      }
    }
    return {
      username: selectedClient.username,
      expenses,
      orders: ordersMade,
      completedOrders,
      testimonials: testimonialsMade,
    };
  }
  return "User doesn't exist";
};

module.exports = { freelancerDashboard, clientDashboard };
