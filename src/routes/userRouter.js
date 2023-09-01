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
} = require('../controller/user.controller');
const multer = require('multer');
const sharp = require('sharp');

const { protect, checkPermission } = require('../controller/auth.controller');
const AppError = require('../utils/AppError');

const router = express.Router();

// multer

// const storage = multer.diskStorage({
//   destination: async function (req, file, cb) {
//     console.log('file', file);
//     console.log('req.file', req.file);

//     cb(null, './public/img/users/');
//   },
//   filename: function (req, file, cb) {
//     const exten = file.mimetype.split('/')[1];
//     const fileName = `user-${req.user._id}-${Date.now()}.${exten}`;
//     cb(null, fileName);
//   },
// });

const filterFile = (req, file, cb) => {
  const isValid = file.mimetype.startsWith('image');
  console.log('from filter file');
  console.log(file);
  // cb(new AppError('This file type does not accept'), isValid);
  if (isValid) {
    cb(null, true);
  } else {
    cb(new AppError('Error file type'), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: filterFile,
});

const resizePhoto = async (req, res, next) => {
  // console.log(req.file);
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

router.route('/').get(protect, getAllUsers);
router
  .route('/updateinfo')
  .patch(
    protect,
    filterOnlyEmailName,
    upload?.single('photo'),
    resizePhoto,
    updateInfo
  );
router.route('/me').get(protect, getMeId, getMe);
router
  .route('/:id')
  .get(getUser)
  .patch(setChangedAt, updateUser)
  .delete(protect, checkPermission('admin'), deleteUser);

module.exports = router;
