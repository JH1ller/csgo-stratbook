import sanitizeHtml from 'sanitize-html';

const config: sanitizeHtml.IOptions = {
  allowedTags: ['span', 'img', 'div', 'br', 'a'],
  allowedAttributes: {
    span: ['contenteditable', 'class', 'data-*', 'style'],
    a: ['contenteditable', 'class', 'target', 'href'],
    img: ['class', 'src'],
  },
};

export const sanitize = (htmlContent: string) => sanitizeHtml(htmlContent, config);
