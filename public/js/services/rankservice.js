var RankService = function() {

};

var locationRanks = [
  {location: 'city', match: function(entity1, entity2) { return entity1.city == entity2.city}},
  {location: 'country', match: function(entity1, entity2) { return entity1.country == entity2.country}},
  {location: 'region', match: function(entity1, entity2) { return entity1.region == entity2.region}},
  {location: 'ww', match: function(entity1, entity2) { return true}}
];

var locationRankMap = {
  city: 3,
  country: 2,
  region: 1,
  ww: 0
};

var englishRankMap = {
  A1: 0,
  A2: 1,
  B1: 2,
  B2: 3,
  C1: 4,
  C2: 5
};

var rankFactor = 4;

RankService.prototype.rankCandidatesToPosition = function(position, candidates, criteriaRank) {
  var keys = _.keys(criteriaRank);
  //TODO: need to add filtering
  var rankedCandidates = [];
  var requiredRank = 3;
  requiredRank += (criteriaRank.startDate && criteriaRank.endDate) ? 1 : 0;

  _.forEach(candidates, function(candidate) {
    var rank = 0;
    var rankInfo = {};

    //location
    for(var i = 0; i < locationRanks.length; i++) {
      if (locationRankMap[criteriaRank.location] > locationRankMap[locationRanks[i].location]) {
        break;
      }
      if (locationRanks[i].match(position, candidate)) {
        rank += 1 + locationRankMap[locationRanks[i].location] / (locationRankMap.city * rankFactor);
        rankInfo.location = locationRanks[i].location;
        break;
      }
    }

    //english
    if (candidate.english > criteriaRank.english) {
      rank += 1 + englishRankMap[candidate.english] / (englishRankMap.C2 * rankFactor);
      rankInfo.english = candidate.english;
    }

    if (candidate.primarySkill == position.primarySkill) {
      rank += 1;
      rankInfo.primarySkill = candidate.primarySkill;
    }

    //workload
    rank += candidate.workload > criteriaRank.workload ? 1 : 0;
    rankInfo.workload = candidate.workload;

    if (criteriaRank.startDate && criteriaRank.endDate) {
      //start/end dates

      var projectStartDate = new Date(Date.parse(position.startDate));
      var candidateStartDate = new Date(Date.parse(candidate.startDate));
      if (projectStartDate <= criteriaRank.endDate &&
          candidateStartDate >= criteriaRank.startDate && candidateStartDate <= criteriaRank.endDate) {
        rank += 1;

        rank += (candidateStartDate.getTime() - projectStartDate.getTime()) / ((criteriaRank.endDate.getTime() - projectStartDate.getTime()) * rankFactor);
      }
    }

    if (rank > requiredRank) {
      rankedCandidates.push({
        rank: rank,
        rankInfo: rankInfo,
        candidate: candidate,
        position: position
      });
    }
  });

   var result = _.sortBy(rankedCandidates, function(item) {
     return item.rank;
   });
   result.reverse();

   console.log(result);
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
