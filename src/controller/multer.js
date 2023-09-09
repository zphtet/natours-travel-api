const multer = require('multer');
const sharp = require('sharp');
// multer

const filterFile = (req, file, cb) => {
  const isValid = file.mimetype.startsWith('image');
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

exports.resizePhoto = async (req, res, next) => {
  // console.log(req.file);
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

exports.uploadSinglePhoto = upload.single('photo');

// many storage

const storeMany = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/tours/');
  },
  filename: function (req, file, cb) {
    const exten = file.mimetype.split('/')[1];
    const filename = `tour-${req.user._id || ''}-${Date.now()}.${exten}`;
    cb(null, filename);
  },
});

const uploadMany = multer({
  storage: storeMany,
});

exports.uploadManyPhoto = uploadMany.fields([
  { name: 'images', maxCount: 3 },
  { name: 'imageCover', maxCount: 1 },
]);
