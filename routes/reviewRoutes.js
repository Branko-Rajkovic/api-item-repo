const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    reviewController.setUserAndItemIdInRequest,
    reviewController.createReview
  )
  .delete(
    authController.protect,
    authController.restrictTo('user-admin', 'admin'),
    reviewController.deleteManyReviews
  );
router
  .route('/deacctivate')
  .patch(
    authController.protect,
    authController.restrictTo('user-admin', 'admin'),
    reviewController.deacctivateManyReviews
  );

router
  .route('/acctivate')
  .patch(
    authController.protect,
    authController.restrictTo('user-admin', 'admin'),
    reviewController.acctivateManyReviews
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo('user-admin', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo('user-admin', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
