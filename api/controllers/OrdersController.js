const Order = require("../models/orderModel");
const { getServiceRating } = require("./TestimonialsController");
const { findServiceById } = require("./ServicesController");
const { findUserById } = require("./UserController");
const { sendMessage } = require("./ChatController");

const findOrder = async (orderId) => {
  const selectedOrder = Order.findById(orderId);
  return selectedOrder;
};

const findClientOrders = async (clientId) => {
  const selectedClient = await findUserById(clientId);
  if (selectedClient) {
    if (selectedClient.role != "client") {
      return "You Don't Have Permission";
    }
    const clientOrders = await Order.find({ clientId }).sort({ updatedAt: -1 });
    if (clientOrders.length != 0) {
      let allOrdersInfo = [];
      for (let i of clientOrders) {
        const serviceInfo = await findServiceById(i.serviceId.toString());
        const serviceRating = await getServiceRating(i.serviceId.toString());
        const serviceUserInfo = await findUserById(serviceInfo.userId);
        const ordersInfo = {
          serviceInfo,
          serviceRating,
          serviceUserInfo,
          status: i.status,
          _id: i._id,
        };
        allOrdersInfo.push(ordersInfo);
      }
      return allOrdersInfo;
    }
    return [];
  }
  return "User Doesn't Exists";
};

const findClientOrder = async (clientId, orderId) => {
  const selectedClient = await findUserById(clientId);
  if (selectedClient) {
    if (selectedClient.role != "client") {
      return "You Don't Have Permission";
    }
    const clientOrder = await findOrder(orderId);
    if (clientOrder) {
      const serviceInfo = await findServiceById(
        clientOrder.serviceId.toString()
      );
      const serviceRating = await getServiceRating(
        clientOrder.serviceId.toString()
      );
      const serviceUserInfo = await findUserById(serviceInfo.userId);
      const orderInfo = {
        serviceInfo,
        serviceRating,
        serviceUserInfo,
        status: clientOrder.status,
        _id: clientOrder._id,
      };
      return orderInfo;
    }
    return "Order Doesn't Exists";
  }
  return "User Doesn't Exists";
};

const makeOrder = async (clientId, serviceId) => {
  const selectedClient = await findUserById(clientId);
  if (selectedClient) {
    if (selectedClient.role != "client") {
      return "You Don't Have Permission";
    }
    const selectedService = await findServiceById(serviceId);
    if (selectedService) {
      const orderExists = await Order.find({
        clientId: selectedClient._id,
        serviceId: selectedService._id,
        status: "OnGoing",
      });
      if (orderExists.length != 0) {
        return "You Already Have A Uncompleted Order For This Service";
      }
      const text = `Hello,I would like to order ${selectedService.title} service`;
      sendMessage(clientId, selectedService.userId, text);
      const createdOrder = Order.create({
        clientId: selectedClient._id,
        serviceId: selectedService._id,
      });
      return "Order Made Successfully";
    }
    return "Service Doesn't Exists";
  }
  return "User Doesn't Exists";
};

const updateOrder = async (clientId, orderId, orderState) => {
  const selectedClient = await findUserById(clientId);
  if (selectedClient) {
    if (selectedClient.role != "client") {
      return "You Don't Have Permission";
    }
    const selectedOrder = await findOrder(orderId);
    if (selectedOrder) {
      if (selectedOrder.clientId.toString() != clientId) {
        return "You Don't Have Permission";
      }
      if (orderState != "Completed" && orderState != "Cancelled") {
        return "Order Status Unrecognized";
      }
      const updatedOrder = Order.updateOne(
        { clientId, _id: orderId, status: "OnGoing" },
        {
          status: orderState,
        }
      );
      return updatedOrder;
    }
    return "Order doesn't exists";
  }
  return "User doesn't exists";
};

module.exports = {
  findClientOrder,
  findClientOrders,
  makeOrder,
  updateOrder,
  findOrder,
};
