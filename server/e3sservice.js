var https = require('https'),
    querystring = require('querystring'),
    fs = require('fs'),
    _ = require('underscore'),
    auth = require('./../auth'),
    cacheService = require('./cacheservice'),
    moment = require('moment');

var PROJECT_ENTITY_TYPE = 'com.epam.e3s.app.project.api.data.ProjectProjectionEntity';
var EMPLOYEE_ENTITY_TYPE = 'com.epam.e3s.app.people.api.data.EmployeeEntity';
var POSITION_ENTITY_TYPE = 'com.epam.e3s.app.position.api.data.PositionProjectionEntity';

// Memory storage for candidates.
var candidates = [];
// Memory storage for positions.
var positions = [];

//https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={"statements":[{"query":"Available Now","fields":["availabilitySum"]}],"start":0,"limit":10}
//https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.position.api.data.PositionProjectionEntity&query={"statements":[{"query":"Position","fields":["reqtype"]}],"filters":[],"start":0,"limit":10}
//https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.project.api.data.ProjectProjectionEntity&query={"statements":[{"query":"Project", "fields":["typeSum"]},{"query":"Active","fields":["statusSum"]}],"start":0,"limit":10}
//https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.company.api.data.BusinessOrgProjectionEntity&query={"statements":[{"query":"*"}],"start":0,"limit":10}


function getItems(auth, type, statements, start, limit, callback) {
  console.log('loading \'' + type + '\' data from E3S.');
  var queryParameters = {
    type: type || 'com.epam.e3s.app.people.api.data.EmployeeEntity',
    query: JSON.stringify({
      statements: statements || [{'query': '*'}],
      start: start || 0,
      limit: limit || 2000 //5000
    })
  };

  https.get({
    hostname: 'e3s.epam.com',
    path: '/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?' + querystring.stringify(queryParameters),
    method: 'GET',
    auth: auth.credentials.username + ':' + auth.credentials.password
  }, function(res) {
    if (res.statusCode == 200) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        console.log('\'' + type + '\' data has been successfully loaded.');
        console.log(data);
        callback(JSON.parse(data));
      });
    } else {
      console.log("Got error trying to load \'" + type + "\': " + res.statusCode);
      callback([]);
    }
  })
};

exports.syncCandidates = function(callback) {
  getItems(auth, EMPLOYEE_ENTITY_TYPE,[{"query":"Available Now","fields":["availabilitySum"]}], null, null,
      function(data) {
        console.log('Synced candidates');
        cacheService.cacheCandidates(mapPersons(data));

        callback();
      });
};

exports.syncPositions = function(callback) {
  getItems(auth, POSITION_ENTITY_TYPE, [
    {"query":"Position","fields":["reqtype"]},
    ], null, null,
      function(data) {
        console.log('Synced positions');
        cacheService.cachePositions(mapPositions(data));

        callback();
      });
};

exports.getCandidates = function(callback) {
  if (candidates.length == 0) {
    console.log('read candidates from cache');
    cacheService.readCandidatesFromCache(function(data) {
      candidates = data;
      callback(data);
    });
  } else {
    console.log('read candidates from memory');
    callback(candidates);
  }
};

exports.getPositions = function(callback) {
  if (positions.length == 0) {
    console.log('Read positions from cache');
    cacheService.readPositionsFromCache(function(data) {
      positions = data;
      callback(data);
    });
  } else {
    console.log('Read positions from memory');
    callback(positions);
  }
};

exports.getProjects = function(callback) {
  getItems(auth, PROJECT_ENTITY_TYPE, [{"query":"Project", "fields":["typeSum"]},{"query":"Active","fields":["statusSum"]}], null, null, function(data) {
    callback(mapProjects(data));
  })
};

function mapPersons(data) {
  return data.items.map(function(item) {
    var person = item.data;
    return {
      city: getFirstItemIfArray(person.city),
      country: getFirstItemIfArray(person.country),
      primarySkill: person.primarySkillSum,
      fullName: person.fullNameSum.full,
      email: person.emailSum,
      id: person.id,
      title: getFirstItemIfArray(person.title),
      skills: {
        expert: getCandidateSkills(person, 'expert'),
        advanced: getCandidateSkills(person, 'advanced'),
        intermediate: getCandidateSkills(person, 'intermediate'),
        novice: getCandidateSkills(person, 'novice')
      },
      positions: getCandidateTakenPositions(person),
      projects: getCandidateProjects(person),
      photoId: getCandidatePhotoId(person),
      english: generateEnglishLevel(),
      workload: generateWorkload(),
      startDate: generateStartDate(),
      startworkdate: moment(person.startworkdate, "YYYY-MM-DD"),
      certificates: (person.certificatesSum || []).length,
      badges: (person.badgesSum || []).length,
      seniorityLevel: Math.floor((Math.random() * 7))
    };
  });
}

function mapPositions(data) {
  return data.items.map(function(item) {
    var position = item.data;
    return {
      primarySkill: position.primaryskill,
      city: position.city,
      country: position.country,
      projectName: position.project,
      position: position.position,
      customer: position.customer,
      customerId: position.customerIdSum,
      id: position.id,
      startDate: generateStartDate()
    };
  });
}

function mapProjects(data) {
  return data.items.map(function(item) {
    var project = item.data;
    return {
      id: project.id,
      name: project.name,
      skills: project.skillSum || [],
      customer: project.customer,
      customerId: project.customerIdSum
    };
  });
}

function getCandidateSkills(person, skillLevel) {
  if (person.skill && person.skill[skillLevel]) {
    return (person.skill[skillLevel] || '').split(", ")
  }
  return [];
}

function getCandidateTakenPositions(person) {
  if (person.workloadSum && person.workloadSum.length) {
    return _.unique(person.workloadSum.map(function(item) {
      return item.projectWorkload[0].position;
    }));
  }
  return [];
}

function getCandidateProjects(person) {
  var workloadProjects = [];
  var workhistoryProjects = [];
  if (person.workloadSum && person.workloadSum.length) {
    var nonemptyProjects = person.workloadSum.filter(function(item) {
      return item.projectWorkload[0].project;
    });

    workloadProjects = nonemptyProjects.map(function(item) {
      return item.projectWorkload[0].project;
    });
  }

  if (person.workhistory && person.workhistory.length) {
    var nonemptyProjects = person.workhistory.filter(function(item) {
      return item.epamproject;
    });

    workhistoryProjects = nonemptyProjects.map(function(item) {
      return item.epamproject;
    });
  }

  return _.unique(_.union(workloadProjects, workhistoryProjects));
};

function generateEnglishLevel() {
  var level = Math.floor((Math.random() * 2) + 1);
  var grade = Math.floor((Math.random() * 3));

  return String.fromCharCode("A".charCodeAt(0) + grade) + level;
};

function generateWorkload() {
  return Number(Math.random().toFixed(2));
};

function getCandidatePhotoId(person) {
  if (person.photosSum && person.photosSum.length) {
    return person.photosSum[0].replace("attachment:\/\/", "");
  }
  return '';
};

function generateStartDate() {
  var start = new Date(2014, 0, 1);
  var end = new Date(2015, 10, 1);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

function getFirstItemIfArray(array) {
  if (array.length) {
    return array[0];
  }
  return array;
};

exports.clearMemoryCache = function() {
  positions = [];
  candidates = [];
};
