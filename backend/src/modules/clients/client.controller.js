const clientService = require('./client.services');

exports.getClients = async (req, res) => {
    try {
        
        const clients = await clientService.getAllClients(req.user.id); 
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addClient = async (req, res) => {
    try {
        
        const newClient = await clientService.createClient(req.body, req.user.id);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.modifyClient = async (req, res) => {
    try {
      
        const updated = await clientService.updateClient(req.params.id, req.body, req.user.id);
        if (!updated) return res.status(404).json({ message: "Client non trouvé ou non autorisé" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.removeClient = async (req, res) => {
    try {
     
        const deleted = await clientService.deleteClient(req.params.id, req.user.id);
        if (!deleted) return res.status(404).json({ message: "Client non trouvé ou non autorisé" });
        res.status(200).json({ message: "Client supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};