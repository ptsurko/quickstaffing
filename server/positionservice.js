var e3sservice = require('./e3sservice'),
    _ = require('underscore');

exports.getPositions = function(callback) {
  e3sservice.getPositions(callback);
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
