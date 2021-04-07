const schemaUtils = require('schema-utils');

const webpack = require('webpack');
const vm = require("vm");
const NativeModule = require("module");
const fs = require("fs");
const path = require("path");

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

// WIP: code taken from decache https://github.com/dwyl/decache/blob/master/decache.js

function decache(moduleName, basedir) {
  // Run over the cache looking for the files
  // loaded by the specified module name
  searchCache(moduleName, basedir, function (mod) {
    delete require.cache[mod.id];
  });

  // Remove cached paths to the module.
  // Thanks to @bentael for pointing this out.
  Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
    if (cacheKey.indexOf(moduleName) > -1) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
}

/**
 * Runs over the cache to search for all the cached
 * files
 */
function searchCache(moduleName, basedir, callback) {
  // Resolve the module identified by the specified name
  var mod = require.resolve(moduleName, [basedir]);
  var visited = {};

  // Check if the module has been resolved and found within
  // the cache no else so #ignore else http://git.io/vtgMI
  /* istanbul ignore else */
  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    // Recursively go over the results
    (function run(current) {
      visited[current.id] = true;
      // Go over each of the module's children and
      // run over it
      current.children.forEach(function (child) {

        // ignore .node files, decachine native modules throws a
        // "module did not self-register" error on second require
        if (path.extname(child.filename) !== '.node' && !visited[child.id]) {
          run(child);
        }
      });

      // Call the specified callback providing the
      // found module
      callback(current);
    })(mod);
  }
};


//
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

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('WebpackWatchSandboxPlugin', (compilation, cb) => {
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
        for (const i in this.context.resolvedModules) {
          // if (i !== `bcrypt` && i !== `chalk` && i !== `morgan` && i !== `helmet` && i !== `ms`
          //   //&& i !== `passport` && i !== `passport-local` && i !== `@nestjs/passport`
          //   )
          if (
            // i === `passport` //||
            // i === `passport-local` ||
            i === `@nestjs/passport`
          ) {
            const mod = require.resolve(i, [__dirname]);

            if (require.cache[mod]) {
              console.log(`decache ${i}`)
              decache(i, __dirname)
            }
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

        if (this.instance != null) {
          this.instance.dispose()
            .then(() => {
              this.instance = script.exports["default"]();

              this.instance.bootstrap()
                .then(() => {
                  cb();
                })
            })
        } else {
          // construct instance
          this.instance = script.exports["default"]();

          this.instance.bootstrap()
            .then(() => {
              cb();
            })
        }
      }
      catch (err) {
        console.log(err)
      }
    });
  }
}

module.exports = WebpackWatchSandboxPlugin;
