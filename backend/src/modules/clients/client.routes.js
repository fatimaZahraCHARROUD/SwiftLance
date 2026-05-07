// f client.routes.js
const express = require('express');
const router = express.Router();
const clientController = require('./client.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/', auth, clientController.getClients);       
router.post('/', auth, clientController.addClient);  
router.put('/:id', auth, clientController.modifyClient); 
router.delete('/:id', auth, clientController.removeClient);

module.exports = router;