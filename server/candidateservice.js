var e3sservice = require('./e3sservice'),
    _ = require('underscore');

exports.getCandidates = function(callback) {
  e3sservice.getCandidates(callback);
};

exports.getCandidateByName = function(name, callback) {
  e3sservice.getCandidates(function(err, candidates) {
    var candidate = _.find(candidates, function(candidate) {
       return candidate.fullName == name;
    });

    if (candidate) {
      callback(null, candidate);
    } else {
      callback(new Error("Unable to find person \'" + name + "\'."));
    }
  });
};
