const express = require('express');
const router = express.Router();
const { createLink, redirectLink, getLinks, getLinksStats } = require('../controllers/link.controller');
const authGuard = require('../middlewares/authGuard')

router.post('/', authGuard, createLink)
router.get('/', authGuard, getLinks)
router.get('/:id/stats', authGuard, getLinksStats)
router.get('/:slug' , redirectLink)

module.exports = router;