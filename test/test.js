const expect = require('chai').expect,
  fs = require('fs-extra'),
  browserify = require('browserify'),
  bl = require('bl'),
  path = require('path'),
  lib = require('./../index');

describe('browserify-extract-registry', function () {

  it ('Exports a registry file', function (done) {

    const registryPath = path.join(__dirname, 'out.json'),
      b = browserify({entries: [path.join(__dirname, 'entry.js')]})
        .plugin(lib, {
          outputFile: registryPath
        });

    fs.removeSync(registryPath);

    b.bundle()
      .pipe(bl((err) => {
        const registry = fs.readJsonSync(path.join(__dirname, 'out.json'));

        expect(err).to.be.null;

        expect(registry[1]).to.have.lengthOf(2);
        expect(registry[1]).to.include.members([2, 3]);
        expect(registry[2]).to.be.empty;
        expect(registry[3]).to.deep.equal([2]);
        expect(registry[4]).to.deep.equal([1]);
        done();
      }));
  });
});