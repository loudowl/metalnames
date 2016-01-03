var uniqueRandomArray = require('unique-random-array');
var metalNames = require("./metal-names.json");


module.exports = {
  all: metalNames,
  random: uniqueRandomArray(metalNames)

};
