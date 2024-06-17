import { minify } from 'html-minifier-terser';

const config = {
  continueOnParseError: true,
  keepClosingSlash: true,
  collapseWhitespace: true,
  quoteCharacter: '"',
};

export const minifyHtml = (htmlContent: string) => minify(htmlContent, config);
