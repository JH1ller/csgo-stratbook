const schemaUtils = require('schema-utils');

const webpack = require('webpack');
const vm = require("vm");
const NativeModule = require("module");
const fs = require("fs");
const path = require("path");

const decache = require('decache');

// WIP: hot reload helper

function compileScript(code, filename, requireProxy) {
  // wrap the bundle code with nodejs specific instructions
  const wrapper = NativeModule.wrap(code);

  // create new vm script context
  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: true,
  });

  const compiledScript = script.runInThisContext();

  // basic nodejs module
  const m = {
    exports: {},
  };

  // execute the wrapped bundle code
  // (this requires: libraryTarget: "commonjs2")
  compiledScript.call(
    m.exports,
    m.exports,
    requireProxy,
    m,
  );

  return m;
}

function requireProxy(filePath) {
  if (filePath.charAt(0) == ".") {
    return requireLocalFile(filePath, this.outputDir);
  }

  return requireModule(filePath, this.basedir, this.resolvedModules);
}

function requireLocalFile(filePath, outputDir) {
  const resolvedPath = path.resolve(outputDir, filePath);

  // console.log(`local-module require: ${filePath} (${resolvedPath})`);

  return require(resolvedPath);
}

function requireModule(filePath, basedir, resolvedModules) {
  filePath = path.posix.join(".", filePath);

  try {
    console.log(`(require-proxy) require: ${filePath}`);

    return require(resolvedModules[filePath] || (
      resolvedModules[filePath] = require.resolve(filePath, [basedir])),
    );
  }
  catch (e) {
    console.log("exception in require proxy:");
    console.log(e);
    return null;
  }
}


/**
 * params schema definition
 */
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
};

class WebpackWatchSandboxPlugin {
  instance = null
  disposeCache = false

  context = {}

  constructor(options = {}) {
    schemaUtils.validate(schema, options, {
      name: 'server.js',
    });

    this.options = {
      ...options,
    };
  }

  /**
   *
   * @param {webpack.Compiler} compiler
   */
  apply(compiler) {

    compiler.hooks.afterEmit.tapPromise('WebpackWatchSandboxPlugin', async (compilation) => {
      const { assets, compiler } = compilation;
      const { options } = this;

      let name;
      const names = Object.keys(assets);
      if (options.name) {
        name = options.name;
        if (!assets[name]) {
          console.error(`Entry ${name} not found. Try one of: ${names.join(' ')}`);
        }
      } else {
        name = names[0];
        if (names.length > 1) {
          console.log(`More than one entry built, selected ${name}. All names: ${names.join(' ')}`);
        }
      }

      if (!compiler.options.output || !compiler.options.output.path) {
        throw new Error('output.path should be defined in webpack config!');
      }

      const entryPoint = `${compiler.options.output.path}/${name}`;

      const file = fs.readFileSync(path.resolve(entryPoint), "utf-8");

      if (this.instance !== null) {
        console.log()
        console.log("reloading...")
        console.log()

        // disposing currently running instance
        await this.instance.dispose();

        for (const i in this.context.resolvedModules) {
          const mod = require.resolve(i, [__dirname]);

          if (require.cache[mod]) {
            console.log('decache', i)
            decache(i, __dirname)
          }
        }
      }

      this.context = {
        basedir: __dirname,
        outputDir: compiler.options.output.path,
        resolvedModules: {},
      }

      try {
        // compile script
        const script = compileScript(
          file,
          name,
          requireProxy.bind(this.context),
        );

        // get <default> export from entry module
        const hasDefaultExport = Object.hasOwnProperty.call(script.exports, "default");
        if (!hasDefaultExport) {
          console.log(`[warning] module ${name} has no default export!`);
        }

        // construct instance
        this.instance = script.exports["default"]();
        await this.instance.bootstrap();
      }
      catch (err) {
        console.log(err)
      }
    });
  }
}

module.exports = WebpackWatchSandboxPlugin;
