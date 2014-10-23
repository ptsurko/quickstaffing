var e3sservice = require('./e3sservice'),
    _ = require('underscore');

exports.getCandidates = function(query, callback) {
  e3sservice.getCandidates(function(candidates) {
    var result = candidates;
    if (query.name) {
      result = _.filter(candidates, function (candidate) {
        return candidate.fullName && candidate.fullName.indexOf(query.name) == 0;
      });
    }
    callback(result);
  });
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
