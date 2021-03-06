var IndexController = function($scope, positionservice, candidateservice) {
  this.positionservice_ = positionservice;
  this.candidateservice_ = candidateservice;

  this.stage_ = new Kinetic.Stage({
    container: 'canvas-container',
    width: 1350,
    height: 100
  });
  this.layer_ = new Kinetic.Layer();

  this.positions = [];
  this.candidates = [];
  this.selectedPositionIndex_ = -1;
  this.selectedCandidates = [];

  this.projectName = '';
  this.rankOptions = {
    location: {
      from: 1,
      to: 4,
      step: 1,
      smooth: false,
      dimension: " ",
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
      to: 5,
      step: 1,
      smooth: false,
      dimension: "",
      scale: [0, 0.25, 0.5, 0.75, 1]
    },
    seniority: {
      from: 1,
      to: 4,
      step: 1,
      smooth: false,
      dimension: " ",
      scale: ['city', 'region', 'country', 'world wide']
    },
    englishLevel: {
      from: 1,
      to: 6,
      step: 1,
      smooth: false,
      dimension: " ",
      scale: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    }
  };

  this.rankValues = {
    location: 3,
    primarySkill: 30,
    startDate: 3,
    workLoad: 3,
    seniority: 2,
    englishLevel: 4
  };

  this.loadCandidates_();
  this.loadPositions_();


// debugger
//       // instantiate the bloodhound suggestion engine
//       var projects = new Bloodhound({
//         datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.project); },
//         queryTokenizer: Bloodhound.tokenizers.whitespace,
//         local: projects
//       });
//
//       // initialize the bloodhound suggestion engine
//       projects.initialize();
//
//       this.projectsDataset.source = projects.ttAdapter();
//     }, this));

  // this.projectsDataset = {
  //   displayKey: 'project',
  //   source: new Bloodhound({
  //     datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.project); },
  //     queryTokenizer: Bloodhound.tokenizers.whitespace,
  //     remote : {
  //       url : '%QUERY',
  //       transport : function(url, options, onSuccess, onError) {
  //           var deferred = $.Deferred();
  //
  //           positionservice.getPositions({}, {limit: 99999})
  //             .then(_.bind(function(positions) {
  //               debugger
  //               var projects = _.chain(positions).filter(function(pos) { return pos.projectName;}).map(function(pos) { return {project: pos.projectName};}).uniq(true).value();
  //               projects.sort();
  //
  //               deferred.resolveWith( projects );
  //             }));
  //
  //
  //
  //           return deferred.promise();
  //       }
  //
  //   }
  //   })
  // };
  // // Typeahead options object
  // this.exampleOptions = {
  //   highlight: true
  // };
  //
  // this.exampleOptionsNonEditable = {
  //   highlight: true,
  //   editable: false // the new feature
  // };
};

IndexController.prototype.loadCandidates_ = function() {
  this.candidateservice_.getCandidates().then(function(response) {
    this.candidates = response;
    this.selectedCandidates = [];
  }.bind(this));
};

IndexController.prototype.loadPositions_ = function() {
  this.positionservice_.getPositions({project: this.projectName}).then(this.onPositionsLoaded_.bind(this));
};

IndexController.prototype.onCandidatesLoaded_ = function(response) {
  console.log(response);
};

IndexController.prototype.onPositionsLoaded_ = function(response) {
  this.positions = response;
};

IndexController.prototype.matchCandidates = function(position, $event, $index) {
  this.selectedPositionIndex_ = $index;
  this.getCandidatesForPosition(position.id);
};

IndexController.prototype.drawLine_ = function(x1, x2, thikness) {
  var y1 = 0;
  var y2 = 100;
  var a = (y2 - y1) / (x2 - x1);
  var b = y2 - a * x2;
  var points = [x1, y1, x2, y2];

  var blueSpline = new Kinetic.Line({
    points: points,
    stroke: '#949494',
    strokeWidth: thikness,
    lineCap: 'round',
    tension: 0.5
  });

  blueSpline.on('mouse');

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
  var selectedPosition = this.positions[this.selectedPositionIndex_];
  var positionId = selectedPosition.id;
  var locationRankValue = this.rankOptions.location.scale[this.rankValues.location - 1];
  var englishLevelValue = this.rankOptions.englishLevel.scale[this.rankValues.englishLevel - 1];
  var workloadValue = this.rankOptions.workLoad.scale[this.rankValues.workLoad - 1];
  var startDate = new Date(2014, 5, 10);
  var endDate = new Date(2015, 0, 1);
  var primarySkill = selectedPosition.primarySkill;

  this.positionservice_.getCandidatesForPosition(positionId, {
    location: locationRankValue,
    primarySkill: primarySkill,
    english: englishLevelValue,
    workload: workloadValue,
    startDate: startDate,
    endDate: endDate
  }).then(this.displayCandidatesForPositions_.bind(this));
};

IndexController.prototype.displayCandidatesForPositions_ = function(response) {
  var candidates = response.map(function(item) {
    return item.candidate;
  });

  if (candidates.length > 0) {
    this.candidates = candidates;
    this.selectedCandidates = [];
  } else {
    console.log('nothing to update');
    this.layer_.clear();
    this.layer_.destroyChildren();
    alert('No matches!');
    return;
  }

  this.layer_.clear();
  this.layer_.destroyChildren();
  var ranks = _.chain(response).map(function(item) { return item.rank;}).uniq().value();
  response.forEach(function(item, index) {
    var elementWidth = 189;
    var x2 = (index * (elementWidth + 2) + elementWidth / 2);
    var x1 = (this.selectedPositionIndex_ * (elementWidth + 2) + elementWidth / 2);
    var thickness = ranks.length - ranks.indexOf(item.rank) || 0;
    this.drawLine_(x1, x2, thickness / 2);
  }, this);
};

IndexController.prototype.changeProjectName = function() {
  this.loadPositions_();
};

IndexController.prototype.onFilterChange = function() {
  if (this.selectedPositionIndex_ > 0) {
    this.getCandidatesForPosition(this.selectedPositionIndex_);
  }
};

IndexController.prototype.selectCandidate = function(candidate) {
  var index = this.selectedCandidates.indexOf(candidate);

  if (index >= 0) {
    this.selectedCandidates.splice(index, 1);
  } else {
    if (this.selectedCandidates.length < 2) {
      this.selectedCandidates.push(candidate);
    }
  }
};

IndexController.prototype.isCandidateSelected = function(candidate) {
  return this.selectedCandidates.indexOf(candidate) >= 0;
};

IndexController.prototype.getSelectedPosition = function() {
  return this.positions[this.selectedPositionIndex_];
};
