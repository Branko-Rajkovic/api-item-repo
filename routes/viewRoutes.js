const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedin, viewController.getOverview);

router.get('/item/:id', authController.isLoggedin, viewController.getItem);

router.get('/login', authController.isLoggedin, viewController.getLoginForm);

router.get('/signin', viewController.getSigninForm);

router.get('/account', authController.protect, viewController.getUserAccount);

router.get('/acctivation-page', viewController.getAcctivationPage);

router.get(
  '/add-item',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getAddItemForm
);

router.get(
  '/item-update/:id',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getUpdateItemPage
);

router.get(
  '/manage-items',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getAllItems
);

router.get(
  '/manage-users',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getAllUsers
);

router.get(
  '/manage-reviews',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getAllReviews
);

router.get(
  '/update-password',
  authController.protect,
  viewController.getPasswordUpdatePage
);

module.exports = router;
