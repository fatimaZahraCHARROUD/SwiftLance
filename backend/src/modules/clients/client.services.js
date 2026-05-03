const Client = require('./client.model');

// Créer un client lié à un utilisateur
exports.createClient = async (data, userId) => {
    return await Client.create({
        ...data,
        createdBy: userId,
    });
};

// Récupérer tous les clients de l'utilisateur connecté
exports.getAllClients = async (userId) => {
    return await Client.find({ createdBy: userId });
};

// Récupérer un seul client (en vérifiant l'appartenance)
exports.getClientById = async (id, userId) => {
    return await Client.findOne({ _id: id, createdBy: userId });
};

// Mettre à jour un client
exports.updateClient = async (id, data, userId) => {
    // On utilise findOneAndUpdate avec le userId pour la sécurité
    return await Client.findOneAndUpdate(
        { _id: id, createdBy: userId }, 
        data, 
        { new: true }
    );
};

// Supprimer un client
exports.deleteClient = async (id, userId) => {
    return await Client.findOneAndDelete({ _id: id, createdBy: userId });
};

//bdlihom b7al dyl project (khas client lier lwa7d user !!!)