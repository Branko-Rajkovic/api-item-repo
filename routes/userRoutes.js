const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.signup
);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.post('/acctivate-account', authController.acctivateAccount);
//protected routes
router.use(authController.protect);

router.patch(
  '/update-my-password',
  authController.restrictTo('user', 'user-admin', 'admin'),
  authController.updatePassword
);

router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/update-me',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.restrictTo('user', 'user-admin', 'admin'),
  userController.updateMe
);

router.patch(
  '/acctivate',
  authController.restrictTo('user-admin', 'admin'),
  userController.acctivateManyUsers
);

router.patch(
  '/deacctivate',
  authController.restrictTo('user-admin', 'admin'),
  userController.deacctivateManyUsers
);

router.delete(
  '/delete-me',
  authController.restrictTo('user', 'user-admin', 'admin'),
  userController.deleteMe
);

router
  .route('/')
  .get(
    authController.restrictTo('user-admin', 'admin'),
    userController.getAllUsers
  )
  .post(
    authController.restrictTo('user-admin', 'admin'),
    userController.createUser
  )

  .delete(
    authController.restrictTo('user-admin', 'admin'),
    userController.deleteUserImage,
    userController.deleteManyUsers
  );

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.restrictTo('user-admin', 'admin'),
    userController.deleteUser
  );

module.exports = router;
