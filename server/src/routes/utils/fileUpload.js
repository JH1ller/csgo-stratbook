const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const fs = require('fs');

const fileStorage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, 'public/upload/');
  },
  filename: function (req, file, next) {
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

const processImage = async (file) => {
  try {
    await sharp(file.path)
      .resize(256, 256)
      .toFile(path.resolve(file.destination, 'temp', file.filename));
    fs.unlinkSync(file.path);
    fs.renameSync(
      path.resolve(file.destination, 'temp', file.filename),
      file.path
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports.uploadMiddleware = uploadMiddleware;
module.exports.processImage = processImage;
