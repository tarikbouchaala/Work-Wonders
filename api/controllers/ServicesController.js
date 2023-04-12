const Service = require("../models/serviceModel");
const { findUserById } = require("./UserController");
const { getServiceRating } = require("./TestimonialsController");
const { existsSync, unlinkSync } = require("fs");

const findUserServices = async (userId) => {
  const user = await findUserById(userId);
  if (user) {
    const services = await Service.find({ userId }).sort({ updatedAt: -1 });
    let servicesInfos = [];
    for (let i of services) {
      const rating = await getServiceRating(i._id.toString());
      servicesInfos.push({ ...i._doc, serviceRating: rating });
    }
    return servicesInfos;
  }
  return null;
};

const findUsersServices = async () => {
  const services = await findServices();
  let servicesRatingAndUser = [];
  for (let i of services) {
    const rating = await getServiceRating(i._id.toString());
    const userInfo = await findUserById(i.userId);
    servicesRatingAndUser.push({ ...i._doc, serviceRating: rating, userInfo });
  }
  return servicesRatingAndUser;
};

const findServiceById = async (serviceId) => {
  const service = await Service.findById(serviceId);
  return service;
};

const findServices = async () => {
  const services = await Service.find();
  return services;
};

const createService = async (title, description, price, userId, images) => {
  const oldService = (await findServices()).find(
    (service) => service.title == title && service.userId == userId
  );
  if (oldService) {
    return null;
  }
  const createdService = await Service.create({
    title,
    description: description,
    price,
    images: images.join("|"),
    userId,
  });
  return createdService;
};

const updateService = async (
  title,
  description,
  price,
  userId,
  images,
  serviceId
) => {
  const selectedUser = await findUserById(userId);
  if (selectedUser) {
    const service = await findServiceById(serviceId);
    if (service) {
      if (userId != service.userId.toString())
        return "This service doesn't belongs to you";

      const serviceNameExists = (await findServices()).find(
        (service) =>
          service.title == title &&
          service.userId == userId &&
          service._id != serviceId
      );
      if (serviceNameExists) {
        return "Service gig already exists";
      }
      for (let imageName of service.images.split("|")) {
        if (existsSync(`./uploads/UsersServices/${imageName}`)) {
          unlinkSync(`./uploads/UsersServices/${imageName}`);
        }
      }
      const updatedService = await Service.findByIdAndUpdate(serviceId, {
        title,
        description,
        price,
        images: images.join("|"),
        userId,
      });
      return "Service Updated Successfully";
    }
    return "Service doesn't exists";
  }
  return "User Doesn't exists";
};

const deleteService = async (userId, serviceId) => {
  const selectedUser = await findUserById(userId);
  if (selectedUser) {
    const service = await findServiceById(serviceId);
    if (service) {
      if (userId != service.userId) return -1;
      for (let imageName of service.images.split("|")) {
        if (existsSync(`./uploads/UsersServices/${imageName}`)) {
          unlinkSync(`./uploads/UsersServices/${imageName}`);
        }
      }
      return await Service.deleteOne({ _id: serviceId });
    }
    return 1;
  }
  return null;
};

module.exports = {
  findUsersServices,
  findUserServices,
  findServiceById,
  createService,
  updateService,
  deleteService,
};
