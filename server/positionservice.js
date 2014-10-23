var e3sservice = require('./e3sservice'),
    _ = require('underscore');

exports.getPositions = function(query, callback) {
  e3sservice.getPositions(function(positions) {
    var result = positions;
    if (query.project) {
      result = _.filter(positions, function (position) {
        return position.projectName && position.projectName.indexOf(query.project) == 0;
      });
    }
    callback(result);
  });
};

exports.getPositionById = function(positionId, callback) {
  e3sservice.getPositions(function(err, positions) {
    var position = _.find(positions, function(position) {
      return position.id == positionId;
    });

    if (position) {
      callback(null, position);
    } else {
      callback(new Error("Unable to find position \'" + id + "\'."));
    }
  });
};
