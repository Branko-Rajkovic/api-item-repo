const express = require('express');
const itemController = require('./../controllers/itemController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:itemId/reviews', reviewRouter);

router
  .route('/item-stats')
  .get(
    authController.protect,
    authController.restrictTo('item-admin', 'admin'),
    itemController.getItemsStat
  );
router
  .route('/')
  .get(itemController.getAllItems)
  .post(
    authController.protect,
    authController.restrictTo('item-admin', 'admin'),
    itemController.createItem
  );

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(
    authController.protect,
    authController.restrictTo('item-admin', 'admin'),
    itemController.updateItem
  )
  .delete(
    authController.protect,
    authController.restrictTo('item-admin', 'admin'),
    itemController.deleteItem
  );

module.exports = router;
