var _ = require('underscore');

function rankCandidatesToPosition(position, candidates, criteriaRank) {
  var keys = _.keys(criteriaRank);
  var rankedCandidates = candidates.map(function(candidate) {
    var rank = 0;
    var rankInfo = {};
    _.forEach(keys, function(key) {
      if ((position[key] && candidate[key]) &&
          (( _.isString(position[key]) && _.isArray(candidate[key]) && _.indexOf(candidate[key], position[key]) >= 0) ||
           (position[key] == candidate[key]))) {
        rank += criteriaRank[key];
        rankInfo[key] = criteriaRank[key];
      }
    });
    return {
      rank: rank,
      rankInfo: rankInfo,
      candidate: candidate,
      position: position
    };
  });

  var result = _.sortBy(rankedCandidates, function(item) {
    return item.rank;
  });
  result.reverse();
  return result;
};

exports.rankCandidatesToPosition = rankCandidatesToPosition;
//TODO: It should work for now.
exports.rankPositionToCandidates = rankCandidatesToPosition;
