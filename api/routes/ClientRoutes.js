const express = require("express");
const { clientDashboard } = require("../controllers/DashboardController");
const {
  findClientOrders,
  makeOrder,
  updateOrder,
  findClientOrder,
} = require("../controllers/OrdersController");
const {
  findUsersServices,
  findServiceById,
} = require("../controllers/ServicesController");
const { createTestimonial } = require("../controllers/TestimonialsController");
const { findUserById } = require("../controllers/UserController");
const VerifyToken = require("../middleware/Auth");
const route = express.Router();

route.get("/dashboard", VerifyToken, async (req, res) => {
  try {
    const dashboard = await clientDashboard(req.userId);
    if (dashboard == "User doesn't exist") {
      return res.json({ status: 404, msg: dashboard });
    } else if (dashboard == "You Don't Have Permission") {
      return res.json({ status: 403, msg: dashboard });
    } else {
      return res.json({ status: 200,  dashboard });
    }
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.get("/allServices", VerifyToken, async (req, res) => {
  try {
    const allServices = await findUsersServices();
    return res.json({ allServices, status: 200 });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.get("/service/:idService", VerifyToken, async (req, res) => {
  try {
    const selectedService = await findServiceById(req.params.idService);
    if (selectedService) {
      const selectedServiceUser = await findUserById(selectedService.userId);
      const serviceInfo = {
        ...selectedService._doc,
        userId: selectedServiceUser,
      };
      return res.json({ selectedService: serviceInfo, status: 200 });
    }
    return res.json({ msg: "Service Not Found", status: 404 });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.get("/orders", VerifyToken, async (req, res) => {
  try {
    const clientOrders = await findClientOrders(req.userId);
    if (clientOrders == "User doesn't exists") {
      return res.json({ status: 404, clientOrders });
    }
    if (clientOrders == "You don't have permission") {
      return res.json({ status: 403, clientOrders });
    }
    return res.json({ status: 200, clientOrders });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.get("/order/:idOrder", VerifyToken, async (req, res) => {
  try {
    const clientOrderInfo = await findClientOrder(
      req.userId,
      req.params.idOrder
    );
    if (
      clientOrderInfo == "User doesn't exists" ||
      clientOrderInfo == "Order Doesn't Exists"
    ) {
      return res.json({ status: 404, clientOrderInfo });
    }
    if (clientOrderInfo == "You don't have permission") {
      return res.json({ status: 403, clientOrderInfo });
    }
    return res.json({ status: 200, clientOrderInfo });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.post("/order", VerifyToken, async (req, res) => {
  try {
    const createdService = await makeOrder(req.userId, req.body.serviceId);
    if (
      createdService == "Service Doesn't Exists" ||
      createdService == "User Doesn't Exists"
    ) {
      return res.json({ status: 404, msg: createdService });
    }
    if (createdService == "You Don't Have Permission") {
      return res.json({ status: 403, msg: createdService });
    }
    if (
      createdService == "You Already Have A Uncompleted Order For This Service"
    ) {
      return res.json({ status: 400, msg: createdService });
    }
    return res.json({ status: 200, msg: createdService });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.put("/order/:orderId", VerifyToken, async (req, res) => {
  try {
    const updatedOrder = await updateOrder(
      req.userId,
      req.params.orderId,
      req.body.status
    );
    if (
      updatedOrder == "Service Doesn't Exists" ||
      updatedOrder == "User Doesn't Exists"
    ) {
      return res.json({ status: 404, msg: updatedOrder });
    }
    if (updatedOrder == "You Don't Have Permission") {
      return res.json({ status: 403, msg: updatedOrder });
    }
    if (updatedOrder == "Order Status Unrecognized") {
      return res.json({ status: 400, msg: updatedOrder });
    }
    if (updatedOrder.modifiedCount == 1) {
      return res.json({ status: 200, msg: "Order Updated Successfully" });
    } else {
      return res.json({ status: 409, msg: "Cannot Update Order Again" });
    }
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.post("/testimonial/:orderId", VerifyToken, async (req, res) => {
  try {
    const createdTestimonial = await createTestimonial(
      req.userId,
      req.params.orderId,
      req.body
    );
    if (
      createdTestimonial == "User doesn't exists" ||
      createdTestimonial == "Service doesn't exists"
    ) {
      return res.json({ status: 404, msg: createdTestimonial });
    }
    if (createdTestimonial == "You Don't Have Permission") {
      return res.json({ status: 403, msg: createdTestimonial });
    }
    return res.json({ status: 200, msg: createdTestimonial });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

module.exports = route;
