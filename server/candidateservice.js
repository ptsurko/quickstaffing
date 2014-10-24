var e3sservice = require('./e3sservice'),
    _ = require('underscore'),
    async = require('async'),
    positionservice = require('./positionservice');

function getCandidates(query, callback) {
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

function getCandidateById(candidateId, callback) {
  e3sservice.getCandidates(function(candidates) {
    var candidate = _.find(candidates, function(candidate) {
       return candidate.id == candidateId;
    });

    callback(candidate);
  });
};

function getPositionsForCandidate(candidateId, criteriaRank, start, limit, callback) {
  async.parallel([
    function(callback) {
      getCandidateById(candidateId, function(candidate) {
        callback(null, candidate);
      });
    },
    function(callback) {
      positionservice.getPositions({}, function(positions) {
        callback(null, positions);
      });
    }
  ], function(err, results) {
    var candidate = results[0];
    var positions = results[1];

    var rankedCandidates = rankservice.rankCandidatesToPosition(candidate, positions, criteriaRank);
    callback(_.chain(rankedCandidates).rest(start).first(limit).value());
  })
};

exports.getPositionsForCandidate = getPositionsForCandidate;
exports.getCandidateById = getCandidateById;
exports.getCandidates = getCandidates;
