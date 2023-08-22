const express = require('express');
const {
  getAllUsers,
  updateUser,
  deleteAllUsers,
  updateInfo,
} = require('../controller/user.controller');

const { protect } = require('../controller/auth.controller')

const router = express.Router();

router.route('/users').get(protect, getAllUsers).delete(deleteAllUsers);
router.route('/users/:id').put(updateUser);
router.route('/updateinfo').patch(updateInfo);


module.exports = router;
