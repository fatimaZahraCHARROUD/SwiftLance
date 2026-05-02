// f client.routes.js
const express = require('express');
const router = express.Router();
const clientController = require('./client.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/', clientController.getClients);      
router.post('/', clientController.addClient);    
router.put('/:id', clientController.modifyClient); 
router.delete('/:id', clientController.removeClient);

module.exports = router;