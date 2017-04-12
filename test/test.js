'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  browserify = require('browserify'),
  path = require('path'),
  sinon = require('sinon'),
  util = require('./../lib/util');

describe('browserify-extract-registry', function () {
  const registryPath = path.join(__dirname, 'out.json'),  
    entryPath = path.join(__dirname, 'entry.js'),
    expectedRegistry = {
      1: [2, 3],
      2: [],
      3: [2],
      4: [1]
    },
    lib = require('./../index');
  let sandbox;

  beforeEach(function () {
    fs.removeSync(registryPath);
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    fs.removeSync(registryPath);
    sandbox.restore();
  });

  it ('exports the correct registry to the specified path', function (done) {
    browserify()
      .add(entryPath)
      .plugin(lib, {
        outputFile: registryPath,
        sortDeps: true
      })
      .bundle((err) => {
        const registry = fs.readJsonSync(path.join(__dirname, 'out.json'));

        expect(err).to.be.null;
        expect(registry).to.deep.equal(expectedRegistry);
        done();
      });
  });

  it ('passes registry object as second argument if callback is defined', function (done) {
    browserify()
      .add(entryPath)
      .plugin(lib, {
        sortDeps: true,
        callback: (err, result)=>{
          expect(err).to.be.null;
          expect(result).to.deep.equal(expectedRegistry);
        }})
      .bundle((err) => {
        expect(err).to.be.null;
        done();
      });
  });

  it ('throws error if neither callback nor outputFile is defined', function (done) {
    expect(()=> browserify().plugin(lib, {})).to.throw(Error);
    done();
  });

  it ('passes error to callback if registry is invalid and both validateRegistry and callback are set', function (done) {
    sandbox.stub(util, 'validateRegistry').throws('Validation error');

    browserify()
      .add(entryPath)
      .plugin(lib, {
        validate: true,
        callback: (err) => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('Validation error');
        }
      })
      .bundle((err) => {
        expect(err).to.be.null;
        done();
      });
  });
});

describe('util', function () {
  const lib = require('./../lib/util');

  describe('validateRegistry', function () {
    const fn = lib[this.title];

    it ('throws error if given bad registry', function () {
      expect(() => fn({
        1: [2]
      })).to.throw(Error);
    });
    it ('returns registry if registry is valid', function (){
      const registry = {
        1: [2],
        2: []
      };

      expect(fn(registry)).to.deep.equal(registry);
    });
  });

  describe('sortDeps', function () {
    const fn = lib[this.title];

    it ('sorts the deps of the given registry', function () {
      const registry = {
          1: [3, 2],
          2: [],
          3: []
        },
        expectedRegistry = {
          1: [2, 3],
          2: [],
          3: []
        };

      fn(registry);
      expect(registry).to.deep.equal(expectedRegistry);
    });
  });

});
