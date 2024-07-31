const express = require('express');
const router = express.Router();
const craftsController = require('../controllers/craftsController');

router.get('/', craftsController.getAllCrafts);
router.post('/', craftsController.createCraft);
router.put('/:id', craftsController.updateCraft);
router.delete('/:id', craftsController.deleteCraft);

module.exports = router;

