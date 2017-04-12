const through = require('through2'),
  fs = require('fs-extra'),
  util = require('./lib/util');

/**
 * From a module-deps stream, build an object mapping each dependency
 * ID to its dependents, and write it to a destination.
 * @param {Object} opts
 * @param {String} opts.outputFile Path to output file
 * @return {Object} - Through object
 */
function extractRegistry(opts) {
  const outputFile = opts && opts.outputFile,
    registry = {};

  return through.obj((row, enc, next) => {
    registry[row.id] = Object.keys(row.deps).map(key => row.deps[key]);
    next(null, row);
  })
  .on('end', () => {
    try {
      if (opts.validate) {
        t = util.validateRegistry(registry);
      }
    } catch (err) {
      if (opts.callback) {
        opts.callback(err);
      }
      if (opts.outputFile) {
        throw err;
      }
      return;
    }
    if (opts.sortDeps) {
      util.sortDeps(registry);
    }
    if (opts.outputFile) {
      fs.outputJsonSync(outputFile, registry);
    }
    if (opts.callback) {
      opts.callback(null, registry);
    }
  });
}


/**
 * A Browserify plugin to extract a bundle's module deps registry to a file.
 * @param  {object}  b Browserify instance
 * @param  {object}  [opts] Configuration options
 * @param  {string}  [opts.outputFile] File path of output file.
 * @param  {boolean} [opts.sortDeps] Sort deps arrays for deterministic registries
 * @param  {function} [opts.callback] Callback function with signature <err, result: object>
 */
function extractRegistryPlugin(b, opts) {

  if (!opts || (!opts.outputFile && !opts.callback)) {
    throw new Error('browserify-extract-registry must have "outputFile" or "callback" set');
  }

  b.pipeline.get('emit-deps').push(extractRegistry(opts));
}

module.exports = extractRegistryPlugin;
