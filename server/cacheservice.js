var fs = require('fs');

var CANDIDATES_CACHE_FILE_NAME = 'cache/candidates.json';
var POSITIONS_CACHE_FILE_NAME = 'cache/positions.json';

exports.cachePositions = function(positions) {
  fs.writeFile(POSITIONS_CACHE_FILE_NAME, JSON.stringify(positions, null, 0), function(err, fd) {
    if (err) {
      console.log(err);
    } else {
      console.log('Cached positions');
    }
  });
};

exports.readPositionsFromCache = function(callback) {
  fs.exists(POSITIONS_CACHE_FILE_NAME, function() {
    fs.readFile(POSITIONS_CACHE_FILE_NAME, function(err, data) {
      if(err) {
        console.log('Error while read positions cache');
      } else {
        positions = JSON.parse(data);
        callback(positions);
      }
    });
  });
};

exports.cacheCandidates = function(candidates) {
  fs.writeFile(CANDIDATES_CACHE_FILE_NAME, JSON.stringify(candidates, null, 0), function(err, fd) {
    if (err) {
      console.log(err);
    } else {
      console.log('Cached candidates');
    }
  });
};

exports.readCandidatesFromCache = function(callback) {
  fs.exists(CANDIDATES_CACHE_FILE_NAME, function() {
    fs.readFile(CANDIDATES_CACHE_FILE_NAME, function(err, data) {
      if(err) {
        console.log('Error while read candidates cache');
      } else {
        candidates = JSON.parse(data);
        callback(candidates);
      }
    });
  });
};