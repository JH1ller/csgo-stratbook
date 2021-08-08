// __transform__/html-loader.js

const htmlLoader = require('html-loader/dist/utils');

/**
 * html-loader ""implementation"" for jest
 */
module.exports = {
  process(src, filename, config, options) {
    const html = htmlLoader.parseSrc(src).value;
    const moduleCode = htmlLoader.getModuleCode(html, []);
    return moduleCode + `// Exports\nmodule.exports = code;`;
  },
};
