var RankService = function() {

};

var locationRanks = [
  {location: 'city', match: function(entity1, entity2) { return entity1.city == entity2.city}, rank: 3},
  {location: 'country', match: function(entity1, entity2) { return entity1.country == entity2.country}, rank: 2},
  {location: 'region', match: function(entity1, entity2) { return entity1.region == entity2.region}, rank: 2},
  {location: 'ww', match: function(entity1, entity2) { return true}, rank: 0}
];

RankService.prototype.rankCandidatesToPosition = function(position, candidates, criteriaRank) {
   var keys = _.keys(criteriaRank);
   var rankedCandidates = candidates.map(function(candidate) {
     var rank = 0;
     var rankInfo = {};
     _.forEach(keys, function(key) {
        if (key == "location") {
          for(var i = 0; i < locationRanks.length; i++) {
            var locationRank = locationRanks[i].match(position, candidate) ? locationRanks[i].rank : 0;
            if (locationRank || criteriaRank.location == locationRanks[i].location) {
              rank += locationRank;
              break;
            }
          }
        } else if (position[key] && candidate[key]) {
          if (position[key] == candidate[key]) {
            rank += criteriaRank[key];
            rankInfo[key] = criteriaRank[key];
          }
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
   if (result && result.length && result[0].rank > 0) {
     result = _.filter(result, function(item) {
       return item.rank > 0;
     });
   }
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
