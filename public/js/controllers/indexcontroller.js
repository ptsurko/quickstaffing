var IndexController = function($scope, positionservice, candidateservice) {
  this.positionservice_ = positionservice;
  this.candidateservice_ = candidateservice;

  this.stage_ = new Kinetic.Stage({
    container: 'canvas-container',
    width: 1020,
    height: 300
  });
  this.layer_ = new Kinetic.Layer();

  this.positions = [];
  this.candidates = [];
  this.selectedCandidate_ = 3;
  this.selectedPositionIndex_ = 2;

  this.projectName = '';
  this.rankOptions = {
    location: {
      from: 1,
      to: 4,
      step: 1,
      smooth: false,
      dimension: " km",
      scale: ['city', 'region', 'country', 'world wide']
    },
    primarySkill: {
      from: 0,
      to: 100,
      step: 10,
      smooth: false,
      dimension: " %",
      scale: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    },
    startDate: {
      from: 1,
      to: 12,
      step: 1,
      smooth: false,
      dimension: " month",
      scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    workLoad: {
      from: 1,
      to: 4,
      step: 1,
      smooth: false,
      dimension: " km",
      scale: ['city', 'region', 'country', 'ww']
    },
    seniority: {
      from: 1,
      to: 4,
      step: 1,
      smooth: false,
      dimension: " km",
      scale: ['city', 'region', 'country', 'world wide']
    },
    englishLevel: {
      from: 1,
      to: 6,
      step: 1,
      smooth: false,
      dimension: " km",
      scale: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    }
  };

  this.rankValues = {
    location: 1,
    primarySkill: 30,
    startDate: 3,
    workLoad: 4,
    seniority: 2,
    englishLevel: 4
  };

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
  this.positionservice_.getPositions({project: this.projectName}).then(this.onPositionsLoaded_.bind(this));
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
  this.selectedPositionIndex_ = $index;

  var elementWidth = $event.currentTarget.clientWidth;
  var x2 = ($index * (elementWidth + 2) + elementWidth / 2);
  var x1 = (this.selectedCandidate_ * (elementWidth + 2) + elementWidth / 2);

  this.getCandidatesForPosition(position.id);
  this.drawLine_(x1, x2);
};

IndexController.prototype.selectCandidate = function($index) {
  this.selectedCandidate_ = $index;
};

IndexController.prototype.drawLine_ = function(x1, x2, thikness) {
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

IndexController.prototype.getCandidatesForPosition = function(positionId) {
  var locationRankValue = this.rankOptions.location.scale[this.rankValues.location - 1];
  console.log(locationRankValue);
  this.positionservice_.getCandidatesForPosition("64de8762-6634-4176-891e-8a69cdae3a50",
      {location: locationRankValue}).then(this.onCandidatesLoaded_.bind(this));
};

IndexController.prototype.changeProjectName = function() {
  this.loadPositions_();
};
