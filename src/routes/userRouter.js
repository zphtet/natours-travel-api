const express = require('express');
const {
  getAllUsers,
  updateUser,
  updateInfo,
  deleteUser,
  setChangedAt,
  filterOnlyEmailName,
  getUser
} = require('../controller/user.controller');

const { protect, checkPermission } = require('../controller/auth.controller');

const router = express.Router();

router.route('/').get(protect, getAllUsers)
router.route('/updateinfo').patch(filterOnlyEmailName,updateInfo);
router
  .route('/:id')
  .get(getUser)
  .patch(setChangedAt , updateUser)
  .delete(protect, checkPermission('admin'), deleteUser);


module.exports = router;
