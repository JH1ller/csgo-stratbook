const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const { unlinkSync, renameSync, readFileSync, mkdirSync, existsSync } = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const fileStorage = multer.diskStorage({
  destination: function (_req, _file, next) {
    next(null, 'public/upload/');
  },
  filename: function (req, file, next) {
    next(null, crypto.randomBytes(20).toString('hex') + path.extname(file.originalname));
  },
});

const fileLimits = {
  fileSize: 10_000_000, // * 10 MB
};

const fileFilter = (_req, file, next) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedFileTypes.includes(path.extname(file.originalname))) {
    next(null, true);
  } else {
    next(null, false);
  }
};

const multerInstance = multer({
  storage: fileStorage,
  limits: fileLimits,
  fileFilter: fileFilter,
});

const uploadSingle = (field) => (req, res, next) => {
  multerInstance.single(field)(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).send({ error: error.message });
    } else if (error) {
      return res.status(400).send({ error: error });
    }
    next();
  });
};

const uploadMultiple = (field) => (req, res, next) => {
  multerInstance.array(field)(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).send({ error: error.message });
    } else if (error) {
      return res.status(400).send({ error: error });
    }
    next();
  });
};

const changeExtension = (fileName, extension) => {
  const segments = fileName.split('.');
  segments.splice(segments.length - 1, 1, extension);
  return segments.join('.');
};

const calculateDimensions = async (filePath, targetWidth, targetHeight) => {
  const { width, height } = await sharp(filePath).metadata();
  return [targetWidth ? Math.min(targetWidth, width) : null, targetHeight ? Math.min(targetHeight, height) : null];
};

const processImage = async (file, targetWidth, targetHeight) => {
  try {
    const tempDir = path.resolve(file.destination, 'temp');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir);
    }
    const [width, height] = await calculateDimensions(file.path, targetWidth, targetHeight);
    const targetFileName = changeExtension(file.filename, 'webp');
    await sharp(file.path)
      .resize(width, height)
      .webp({ quality: 70 })
      .toFile(path.resolve(file.destination, 'temp', targetFileName));
    unlinkSync(file.path);
    renameSync(path.resolve(file.destination, 'temp', targetFileName), path.resolve(file.destination, targetFileName));
    await uploadFile(path.resolve(file.destination, targetFileName), targetFileName);
    return targetFileName;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

function uploadFile(filepath, filename) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileContent = readFileSync(filepath);
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename, // filename on S3
        Body: fileContent,
      };

      const data = await s3.upload(params).promise();
      console.log(`File uploaded successfully. ${data.Location}`);
      resolve(data.Location);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function deleteFile(filename) {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename, // filename on S3
      };

      const data = await s3.deleteObject(params).promise();
      console.log(data);

      // TODO: check if data.Location is correct, seems to return undefined
      console.log(`File deleted successfully. ${data.location}`);
      resolve(data.Location);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports.uploadSingle = uploadSingle;
module.exports.uploadMultiple = uploadMultiple;
module.exports.processImage = processImage;
module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;
