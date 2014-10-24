var IndexController = function(e3sservice) {
  this.e3sservice_ = e3sservice;

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
};

IndexController.prototype.loadCandidates_ = function() {
  this.e3sservice_.getCandidates().then(this.onCandidatesLoaded_.bind(this));
};

IndexController.prototype.loadPositions_ = function() {
  this.e3sservice_.getPosition().then(this.onPositionsLoaded_.bind(this));
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
  var elementWidth = $event.srcElement.clientWidth;
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
