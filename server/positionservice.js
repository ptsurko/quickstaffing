var e3sservice = require('./e3sservice'),
    _ = require('underscore'),
    candidateservice = require('./candidateservice'),
    async = require('async');

function getPositions(query, callback) {
  e3sservice.getPositions(function(positions) {
    var result = positions;
    if (query.project) {
      result = _.filter(positions, function (position) {
        return position.projectName && position.projectName.indexOf(query.project) == 0;
      });
    }
    callback(result);
  });
};

function getPositionById(positionId, callback) {
  e3sservice.getPositions(function(positions) {
    var position = _.find(positions, function(position) {
      return position.id == positionId;
    });

    callback(position);
  });
};


function getCandidatesForPosition(positionId, criteriaRank, callback) {
  async.parallel([
    function(callback) {
      getPositionById(positionId, function(position) {
        callback(null, position);
      });
    },
    function(callback) {
      candidateservice.getCandidates({}, function(candidates) {
        callback(null, candidates);
      });
    }
  ], function(err, results) {
    var position = results[0];
    var candidates = results[1];
//    console.log(position);
//    console.log(candidates);
    callback();
  })
};


exports.getCandidatesForPosition = getCandidatesForPosition;
exports.getPositions = getPositions;
exports.getPositionById = getPositionById;
