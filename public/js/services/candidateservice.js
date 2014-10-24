
var CandidateService = function(e3sservice, $q) {
  this.e3sservice_ = e3sservice;
  this.q_ = $q;
};

CandidateService.prototype.getCandidates = function(options) {
  var opt = _.extend({}, options, {start:0, limit: 7});
  return this.e3sservice_.getCandidates()
    .then(function(data) {
      return _.chain(data).rest(opt.start).first(opt.limit).value();
    });
};

CandidateService.prototype.getCandidate = function(candidateId) {
  return this.e3sservice_.getCandidates()
    .then(function(candidates) {
      return _.find(candidates, function(candidate) {
        return candidate.id == candidateId;
      });
    });
};

CandidateService.prototype.getPositionsForCandidate = function(candidateId, criteriaRank) {
  return this.q_.all([
    this.getCandidateById(candidateId),
    this.getPositions()
  ]).then(function(data) {
    var candidate = data[0];
    var positions = data[1];

    return this.rankservice_.rankPositionsToCandidate(candidate, positions, criteriaRank);
  });
};
