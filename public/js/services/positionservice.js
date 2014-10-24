
var PositionService = function(e3sservice, rankservice, $q) {
  this.e3sservice_ = e3sservice;
  this.rankservice_ = rankservice;
  this.q_ = $q;
};

PositionService.prototype.getPositions = function(options) {
  var opt = _.extend({}, options, {start:0, limit: 10});
  return this.e3sservice_.getPositions()
      .then(function(data) {
        return _.chain(data).rest(opt.start).first(opt.limit).value();
      });
};

PositionService.prototype.getPosition = function(positionId) {
  return this.getPositions()
    .then(function(positions) {
      return _.find(positions, function(position) {
        return position.id == positionId;
      });
    });
};

PositionService.prototype.getCandidatesForPosition = function(positionId, criteriaRank) {
  return this.q_.all([
    this.getPositionById(positionId),
    this.getCandidates(),
  ]).then(function(data) {
    var position = data[0];
    var candidates = data[1];

    return this.rankservice_.rankCandidatesToPosition(position, candidates, criteriaRank);
  });
};
