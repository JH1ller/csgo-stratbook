const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const fileStorage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, 'public/upload/');
  },
  filename: function (req, file, next) {
    console.log(file);
    next(
      null,
      crypto.randomBytes(20).toString('hex') + path.extname(file.originalname)
    );
  },
});

const fileLimits = {
  fileSize: 1000000,
};

const fileFilter = (req, file, next) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedFileTypes.includes(path.extname(file.originalname))) {
    next(null, true);
  } else {
    next(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  limits: fileLimits,
  fileFilter: fileFilter,
}).single('avatar');

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).send({ error: error.message });
    } else if (error) {
      return res.status(400).send({ error: error });
    }
    next();
  });
};

module.exports.uploadMiddleware = uploadMiddleware;
