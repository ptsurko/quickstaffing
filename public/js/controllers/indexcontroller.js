var IndexController = function($scope, positionservice, candidateservice) {
  this.positionservice_ = positionservice;
  this.candidateservice_ = candidateservice;

  $scope.value = "50";
  $scope.options = {
    from: 1,
    to: 50,
    step: 1,
    dimension: " km"
  };

  this.stage_ = new Kinetic.Stage({
    container: 'canvas-container',
    width: 1020,
    height: 300
  });
  this.layer_ = new Kinetic.Layer();

  this.positions = [];
  this.candidates = [];
  this.selectedCandidate_ = 3;

  this.loadCandidates_();
  this.loadPositions_();

  // this.positionservice_.getPosition("64de8762-6634-4176-891e-8a69cdae3a50")
  //   .then(function(data) {
  //     debugger
  //   });
  //
  // this.candidateservice_.getCandidate("14bcc033-d105-440b-b16e-9c4867878632")
  //   .then(function(data) {
  //     debugger
  //   });

  this.positionservice_.getCandidatesForPosition("64de8762-6634-4176-891e-8a69cdae3a50", {location: 'country', english:'B2', workload: 0.4, startDate: new Date(2014, 5, 10), endDate: new Date(2015, 0, 1)})
    .then(function(data) {
      console.log(data);
    });
  //
  // this.candidateservice_.getPositionsForCandidate("14bcc033-d105-440b-b16e-9c4867878632", {primarySkill: 10})
  //   .then(function(data) {
  //     debugger
  //   });
};

IndexController.prototype.loadCandidates_ = function() {
  this.candidateservice_.getCandidates().then(this.onCandidatesLoaded_.bind(this));
};

IndexController.prototype.loadPositions_ = function() {
  this.positionservice_.getPositions().then(this.onPositionsLoaded_.bind(this));
};

IndexController.prototype.onCandidatesLoaded_ = function(response) {
  this.candidates = response;
  console.log(response);
};

IndexController.prototype.onPositionsLoaded_ = function(response) {
  this.positions = response;
  console.log(response);
};

IndexController.prototype.matchCandidates = function(position, $event, $index) {
  var elementWidth = $event.currentTarget.clientWidth;
  var x2 = ($index * (elementWidth + 2) + elementWidth / 2);
  var x1 = (this.selectedCandidate_ * (elementWidth + 2) + elementWidth / 2);


// Do not remove it!!!
// var x1 = ($index * (elementWidth + 2) + elementWidth / 2);
// var x2 = (this.selectedCandidate_ * (elementWidth + 2) + elementWidth / 2);
  this.drawLine_(x1, x2);
};

IndexController.prototype.selectCandidate = function($index) {
  this.selectedCandidate_ = $index;
};

IndexController.prototype.drawLine_ = function(x1, x2) {
  var y1 = 0;
  var y2 = 300;
  var a = (y2 - y1) / (x2 - x1);
  var b = y2 - a * x2;
  var points = [x1, y1];
  var point = this.calcX_(a, b, MathUtil.getRandomInt(60, 100)) - MathUtil.getRandomInt(80, 160);

  points.push(point);
  points.push(MathUtil.getRandomInt(120, 160));
  points.push(this.calcX_(a, b, MathUtil.getRandomInt(180, 220)) + MathUtil.getRandomInt(80, 160));
  points.push(MathUtil.getRandomInt(180, 220));
  points.push(x2); points.push(y2);

  var blueSpline = new Kinetic.Line({
    points: points,
    stroke: 'black',
    strokeWidth: MathUtil.getRandom(0.1, 3),
    lineCap: 'round',
    tension: 0.5
  });

  this.layer_.add(blueSpline);
  this.stage_.add(this.layer_);
};

IndexController.prototype.calcX_ = function(a, b, y) {
  if (a == Infinity) {
    return y;
  }
  return (y - b) / a;
};
