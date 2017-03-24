const through = require('through2');

/**
 * From a module-deps stream, build an object mapping each dependency
 * ID to its dependents, and write it to a destination.
 * @param {String} dest - Destination
 * @return {Object} - Through object
 */
function exportRegistry(opts) {
  const opts = opts || {},
    outputFile = opts.outputFile || './bundle-registry.json',
    registry = {};

  return through.obj((row, enc, next) => {
    registry[row.id] = Object.keys(row.deps).map(key => rows.deps[key]);
    next(null, row);
  })
  .on('end', () => fs.outputJson(outputFile, registry));
}


/**
 * A Browserify plugin to extract a bundle's module deps registry to a file.
 * @param  {object}  b Browserify instance
 * @param  {object}  opts Configuration options
 * @param  {string}  opts.outputFile File path of output file. Default: './bundle-registry.json'
 */
function extractRegistryPlugin(b, opts) {
  b.pipeline.get('emit-deps').push(exportRegistry(opts.outputFile));
}

module.exports = extractRegistryPlugin;