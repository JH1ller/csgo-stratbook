const colors = require('colors');

const truncate = (input, length) => (input.length > length ? `${input.substring(0, length)}...` : input);

const logger = (req, _res, next) => {
  try {
    const bodyCopy = { ...req.body };
    delete bodyCopy.password;
    console.log(
      `HTTP ${req.method} ${req.url}`.green,
      ...Object.entries(bodyCopy).map(
        ([key, value], index) => `${index !== 0 ? '| ' : ' '}${key}: ${truncate(value, 50)}`.blue
      )
    );
  } catch (error) {}
  next();
};

module.exports = logger;
