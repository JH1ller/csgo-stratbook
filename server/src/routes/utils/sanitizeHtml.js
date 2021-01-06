const sanitizeHtml = require('sanitize-html');

const config = {
  allowedTags: ['span', 'img', 'div'],
  allowedAttributes: {
    span: ['contenteditable', 'class', 'data-*'],
    img: ['class', 'src'],
  },
};

const sanitize = (htmlContent) => sanitizeHtml(htmlContent, config);

module.exports.sanitize = sanitize;
