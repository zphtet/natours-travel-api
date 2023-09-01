const express = require('express');
const {
  getAllUsers,
  updateUser,
  updateInfo,
  deleteUser,
  setChangedAt,
  filterOnlyEmailName,
  getUser,
  getMe,
  getMeId,
  addPhototoBody,
} = require('../controller/user.controller');
const multer = require('multer');

const { protect, checkPermission } = require('../controller/auth.controller');

const router = express.Router();

// multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file', file);
    cb(null, './public/img/users/');
  },
  filename: function (req, file, cb) {
    const exten = file.mimetype.split('/')[1];
    const fileName = `user-${req.user._id}-${Date.now()}.${exten}`;
    cb(null, fileName);
  },
});

const filterFile = (req, file, cb) => {
  // const isValid = file.mimetype.startsWith('image');
  console.log('from filter file');
  console.log(file);
  // cb(new AppError('This file type does not accept'), isValid);
  cb(null, ture);
};

const upload = multer({
  storage: storage,
  // fileFilter: filterFile,
});

router.route('/').get(protect, getAllUsers);
router
  .route('/updateinfo')
  .patch(protect, filterOnlyEmailName, upload?.single('photo'), updateInfo);
router.route('/me').get(protect, getMeId, getMe);
router
  .route('/:id')
  .get(getUser)
  .patch(setChangedAt, updateUser)
  .delete(protect, checkPermission('admin'), deleteUser);

module.exports = router;
