const express = require('express');
const router = express.Router();
const SiteController = require('../app/controllers/SiteController');

router.get('/', SiteController.getAllUser);
router.delete('/', SiteController.deleteUser);

module.exports = router;
