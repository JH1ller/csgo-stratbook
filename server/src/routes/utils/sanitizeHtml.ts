import sanitizeHtml from 'sanitize-html';

const config: sanitizeHtml.IOptions = {
  allowedTags: ['span', 'img', 'div', 'br'],
  allowedAttributes: {
    span: ['contenteditable', 'class', 'data-*', 'style'],
    img: ['class', 'src'],
  },
};

export const sanitize = (htmlContent: string) => sanitizeHtml(htmlContent, config);
