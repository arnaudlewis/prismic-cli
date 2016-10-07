'use strict';

var request = require('request');
var config = require('./config');

module.exports = {
  UI: {
    displayServerErrors: function(err) {
      var errors = JSON.parse(err).errors;
      var output = Object.keys(errors).reduce(function(acc, field) {
        return acc + errors[field].join('\n') + "\n";
      }, "Error(s):\n");
      console.log(output)
    }
  }
}
