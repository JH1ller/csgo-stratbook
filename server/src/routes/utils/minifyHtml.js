const { minify } = require('html-minifier');

const config = {
  continueOnParseError: true,
  keepClosingSlash: true,
  collapseWhitespace: true,
  quoteCharacter: '"',
};

const minifyHtml = (htmlContent) => minify(htmlContent, config);

module.exports.minify = minifyHtml;
