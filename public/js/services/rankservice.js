var RankService = function() {

};

RankService.prototype.rankCandidatesToPosition = function(position, candidates, criteriaRank) {
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

RankService.prototype.rankPositionsToCandidate = function(candidate, positions, criteriaRank) {
   var keys = _.keys(criteriaRank);
   var rankedPositions = positions.map(function(position) {
     var rank = 0;
     var rankInfo = {};
     _.forEach(keys, function(key) {
       if ((candidate[key] && position[key]) &&
           (candidate[key] == position[key])) {
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

   var result = _.sortBy(rankedPositions, function(item) {
     return item.rank;
   });
   result.reverse();
   return result;
};
