const through = require('through2'),
  fs = require('fs-extra');

/**
 * From a module-deps stream, build an object mapping each dependency
 * ID to its dependents, and write it to a destination.
 * @param {Object} opts
 * @param {String} opts.outputFile Path to output file
 * @return {Object} - Through object
 */
function exportRegistry(opts) {
  const outputFile = opts && opts.outputFile || './bundle-registry.json',
    registry = {};

  return through.obj((row, enc, next) => {
    registry[row.id] = Object.keys(row.deps).map(key => row.deps[key]);
    next(null, row);
  })
  .on('end', () => fs.outputJsonSync(outputFile, registry));
}


/**
 * A Browserify plugin to extract a bundle's module deps registry to a file.
 * @param  {object}  b Browserify instance
 * @param  {object}  opts Configuration options
 * @param  {string}  opts.outputFile File path of output file. Default: './bundle-registry.json'
 */
function extractRegistryPlugin(b, opts) {
  b.pipeline.get('emit-deps').push(exportRegistry(opts));
}

module.exports = extractRegistryPlugin;