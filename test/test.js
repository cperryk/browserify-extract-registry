'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  browserify = require('browserify'),
  bl = require('bl'),
  path = require('path'),
  lib = require('./../index');

describe('browserify-extract-registry', function () {
  const registryPath = path.join(__dirname, 'out.json');

  beforeEach(function () {
    fs.removeSync(registryPath);
  });
  afterEach(function () {
    fs.removeSync(registryPath);
  });

  it ('Exports the correct registry file to the specified path', function (done) {
    browserify()
      .add(path.join(__dirname, 'entry.js'))
      .plugin(lib, {outputFile: registryPath})
      .bundle()
      .pipe(bl((err) => {
        const registry = fs.readJsonSync(path.join(__dirname, 'out.json'));

        sortDeps(registry);
        expect(err).to.be.null;
        expect(registry).to.deep.equal({
          1: [2, 3],
          2: [],
          3: [2],
          4: [1]
        });
        done();
      }));
  });
});

/**
 * Sort a registry's dependency arrays for easier testing.
 * @param {Object} registry
 */
function sortDeps(registry) {
  Object.keys(registry).forEach(key => registry[key].sort());
}
