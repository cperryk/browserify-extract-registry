# browserify-extract-registry

Export a Browserify bundle's "dependency registry," a mapping of modules to their dependencies.

## Installation

`npm install browserify-extract-registry --save`

## Usage

```
// main.js
require('./a');
require('./c');
```

```
// a.js
require('c');
```

```
// b.js
console.log('do nothing!');
```

```
// c.js
console.log('do nothing!');
```

```
const extractRegistry = require('browserify-extract-registry');

browserify()
  .add('./main.js')
  .plugin(extractRegistry, {
    outputFile: './registry.json'
  });
```

This will result in a `registry.json` like the following. (Note: Browserify assigns modules numeric IDs.)

```
{
  "1": [2, 3, 4], // "main" requires "a" and "c"
  "2": [4] // "a" requires "b"
  "3": [] // "b" has no deps
  "4": [] // "c" has no deps
}
```

## Why does this exist?

This plugin is designed for scenarios in which you need outside access to a bundle's dependencies.

It can be used alongside [browserify-splitter](https://github.com/cperryk/browserify-splitter) to compute dependencies and generate dynamic bundles at runtime.
