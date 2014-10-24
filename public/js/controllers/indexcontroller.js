angular.module('QuickStaffing', [])
  .controller('IndexController', ['$scope', 'e3sservice', function($scope, e3sservice) {
    e3sservice.getCandidates(function() {
      debugger
    });
  }]);


var IndexController = function($scope, $http) {
  this.scope_ = $scope;
  this.http_ = $http;

  this.candidates = [{
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  },{
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  }, {
    fullName: 'Dzmitry Ulasau'
  }];

  this.positions = [{
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  },{
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }, {
    projectName: 'Signpost',
    customer: 'Google',
    id: 1111
  }];
};

IndexController.prototype.matchCandidates = function(position, $event, $index) {
  var elementWidth = $event.srcElement.clientWidth;
  var x1 = ($index * (elementWidth + 2) + elementWidth / 2);
  var x2 = (driveToIndex * (elementWidth + 2) + elementWidth / 2);

//        var x2 = ($index * (elementWidth + 2) + elementWidth / 2);
//        var x1 = (driveToIndex * (elementWidth + 2) + elementWidth / 2);

  drawLine(x1, x2);
};

IndexController.prototype.selectCandidate = function($index) {
  driveToIndex = $index;
};

var driveToIndex = 9;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1012,
  height: 360
});
var layer = new Kinetic.Layer();


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var drawLine = function(x1, x2) {
  var y1 = 0;
  var y2 = 350;

  var a = (y2 - y1) / (x2 - x1);
  var b = y2 - a * x2;
  var points = [x1, y1];

  var point = calcX(a, b, getRandomInt(60, 100)) - getRandomInt(80, 160);
  console.log(calcX(a, b, getRandomInt(60, 100)) - getRandomInt(80, 160));
  console.log(point);
  points.push(point);
  points.push(getRandomInt(120, 160));

  points.push(calcX(a, b, getRandomInt(180, 220)) + getRandomInt(80, 160));
  points.push(getRandomInt(180, 220));

  points.push(x2); points.push(y2);

  var blueSpline = new Kinetic.Line({
    points: points,
    stroke: 'black',
    strokeWidth: getRandom(0.1, 3),
    lineCap: 'round',
    tension: 0.5
  });

  layer.add(blueSpline);
  stage.add(layer);
};

var calcY = function(a, b, x) {
  return a * x + b;
};

var calcX = function(a, b, y) {
  if (a == Infinity) {
    return y;
  }
  return (y - b) / a;
};