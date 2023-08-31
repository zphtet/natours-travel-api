const express = require('express');
const viewController = require('../controller/view.controller');
const { isLoggedIn, protect } = require('../controller/auth.controller');

const router = express.Router();

router.route('/me').get(protect, viewController.getProifile);

router.use(isLoggedIn);
router.route('/').get(viewController.getOverview);
router.route('/login').get(viewController.login);
router.route('/signup').get(viewController.signup);
router.route('/tour/:slug').get(viewController.getTour);

module.exports = router;
