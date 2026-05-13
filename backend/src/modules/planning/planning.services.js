const Planning = require("./planning.model");

exports.create = async (data) => {
  return await Planning.create(data);
};

exports.getAll = async (userId) => {
  return await Planning.find({ userId });
};

exports.getOne = async (id) => {
  return await Planning.findById(id);
};

exports.update = async (id, data) => {
  return await Planning.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return await Planning.findByIdAndDelete(id);
};