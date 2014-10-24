
var PositionService = function(e3sservice, rankservice, $q) {
  this.e3sservice_ = e3sservice;
  this.rankservice_ = rankservice;
  this.q_ = $q;
};

PositionService.prototype.getPositions = function(query, options) {
  var opt = _.extend({}, {start:0, limit: 10}, options);
  return this.e3sservice_.getPositions()
      .then(function(data) {
        var result = data;
        if (query && query.project) {
          result = _.filter(result, function(position) {
            return position.projectName && position.projectName.toLowerCase().indexOf(query.project.toLowerCase()) == 0;
          });
        }
        return _.chain(result).rest(opt.start).first(opt.limit).value();
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
  var criteria = _.extend({}, {workload: 0, english: 'A1', location: 'ww'}, criteriaRank);
  console.log(criteria);
  return this.q_.all([
    this.getPosition(positionId),
    this.e3sservice_.getCandidates(),
  ]).then(_.bind(function(data) {
    var position = data[0];
    var candidates = data[1];

    var rankedCandidates = this.rankservice_.rankCandidatesToPosition(position, candidates, criteria);
    return _.chain(rankedCandidates).rest(opt.start).first(opt.limit).value();
  }, this));
};
