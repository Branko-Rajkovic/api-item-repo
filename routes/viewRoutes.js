const express = require('express');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/item/:id', viewController.getItem);

module.exports = router;
