const express = require('express');
const router = express.Router();

const { statsVisit } = require("../controllers/statsController");

router.get('/visits', statsVisit);

module.exports = router;