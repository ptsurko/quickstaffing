
var PositionService = function(e3sservice, rankservice, $q) {
  this.e3sservice_ = e3sservice;
  this.rankservice_ = rankservice;
  this.q_ = $q;
};

PositionService.prototype.getPositions = function(options) {
  var opt = _.extend({}, {start:0, limit: 10}, options);
  return this.e3sservice_.getPositions()
      .then(function(data) {
        return _.chain(data).rest(opt.start).first(opt.limit).value();
      });
};

PositionService.prototype.getPosition = function(positionId) {
  return this.e3sservice_.getPositions()
    .then(function(positions) {
      return _.find(positions, function(position) {
        return position.id == positionId;
      });
    });
};

PositionService.prototype.getCandidatesForPosition = function(positionId, criteriaRank, options) {
  var opt = _.extend({}, {start:0, limit: 10}, options);
  return this.q_.all([
    this.getPosition(positionId),
    this.e3sservice_.getCandidates(),
  ]).then(_.bind(function(data) {
    var position = data[0];
    var candidates = data[1];

    var rankedCandidates = this.rankservice_.rankCandidatesToPosition(position, candidates, criteriaRank);
    return _.chain(rankedCandidates).rest(opt.start).first(opt.limit).value();
  }, this));
};
