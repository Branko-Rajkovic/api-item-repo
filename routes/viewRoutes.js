const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedin);

router.get('/', viewController.getOverview);

router.get('/item/:id', viewController.getItem);

router.get('/login', viewController.getLoginForm);

router.get('/signin', viewController.getSigninForm);

module.exports = router;
