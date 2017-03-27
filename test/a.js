const a = require('./b');
  b = require('./c');

module.exports = function () {
  a();
  b();
}