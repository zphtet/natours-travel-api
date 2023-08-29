const express = require('express');
const viewController = require('../controller/view.controller');
const { isLoggedIn } = require('../controller/auth.controller');

const router = express.Router();

router.use(isLoggedIn);
router.route('/').get(viewController.getOverview);
router.route('/login').get(viewController.login);
router.route('/tour/:slug').get(viewController.getTour);

module.exports = router;
