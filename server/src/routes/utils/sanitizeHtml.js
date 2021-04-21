const sanitizeHtml = require('sanitize-html');

const config = {
  allowedTags: ['span', 'img', 'div', 'br'],
  allowedAttributes: {
    span: ['contenteditable', 'class', 'data-*', 'style'],
    img: ['class', 'src'],
  },
};

const sanitize = (htmlContent) => sanitizeHtml(htmlContent, config);

module.exports.sanitize = sanitize;
