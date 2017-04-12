/**
 * Validate the specified registry, ensuring each module's dependencies are in the registry.
 * @param {object} registry
 * @returns {object} registry
 */
function validateRegistry(registry) {
  Object.keys(registry).forEach((key) => {
    registry[key].forEach((dep) => {
      if (registry[dep] === undefined) {
        throw new Error(`Registry invalid; missing ${dep}, which is required by ${key}`);
      }
    });
  });
  return registry;
};

/**
 * Sort a registry's dependency arrays for easier testing.
 * @param {Object} registry
 */
function sortDeps(registry) {
  Object.keys(registry).forEach(key => registry[key].sort());
}


module.exports.validateRegistry = validateRegistry;
module.exports.sortDeps = sortDeps;
