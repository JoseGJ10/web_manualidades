// routes/index.js
const express = require('express');
const path = require('path');
const router = express.Router();
const Craft = require('../models/craft');

// Ruta para la página principal
router.get('/', (req, res) => {
  res.status(200).sendfile(path.join(__dirname,'../public/index.html'));
});

router.get('/cms', async (req, res) => {
  res.status(200).sendfile(path.join(__dirname,'../public/pages/cms.html'));
});

module.exports = router;