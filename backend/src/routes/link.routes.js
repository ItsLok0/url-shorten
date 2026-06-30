const express = require('express');
const router = express.Router();
const { createLink } = require('../controllers/link.controller');
const { redirectLink } = require('../controllers/link.controller')
const authGuard = require('../middlewares/authGuard')

router.post('/', authGuard, createLink);
router.get('/:slug' , redirectLink);

module.exports = router;