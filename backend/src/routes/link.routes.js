const express = require('express');
const router = express.Router();
const { createLink } = require('../controllers/link.controller');
const { redirectLink } = require('../controllers/link.controller')

router.post('/', createLink);
router.get('/:slug' , redirectLink);

module.exports = router;