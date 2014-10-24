
var CandidateService = function(e3sservice, $q, rankservice) {
  this.e3sservice_ = e3sservice;
  this.q_ = $q;
  this.rankservice_ = rankservice;
};

CandidateService.prototype.getCandidates = function(options) {
  var opt = _.extend({}, {start:0, limit: 10}, options);
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

CandidateService.prototype.getPositionsForCandidate = function(candidateId, criteriaRank, options) {
  var opt = _.extend({}, {start:0, limit: 10}, options);
  return this.q_.all([
    this.getCandidate(candidateId),
    this.e3sservice_.getPositions(),
  ]).then(_.bind(function(data) {
    var candidate = data[0];
    var positions = data[1];

    var rankedPositions = this.rankservice_.rankPositionsToCandidate(candidate, positions, criteriaRank);
    return _.chain(rankedPositions).rest(opt.start).first(opt.limit).value();
  }, this));
};
