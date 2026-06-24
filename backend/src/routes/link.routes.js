const express = require('express');
const router = express.Router();
const { createLink } = require('../controllers/link.controller');

router.post('/', createLink);

module.exports = router;