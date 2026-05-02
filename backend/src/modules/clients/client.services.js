const Client = require('./client.model');

const getAllClients = () => Client.find();
const createClient = (data) => Client.create(data);
const updateClient = (id, data) => Client.findByIdAndUpdate(id, data, { new: true });
const deleteClient = (id) => Client.findByIdAndDelete(id);

module.exports = {
    getAllClients,
    createClient,
    updateClient,
    deleteClient
};
