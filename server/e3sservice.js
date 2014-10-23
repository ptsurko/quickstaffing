var https = require('https'),
    querystring = require('querystring'),
    fs = require('fs'),
    _ = require('underscore'),
    auth = require('./../auth'),
    cacheService = require('./cacheservice');

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
  var queryParameters = {
    type: type || 'com.epam.e3s.app.people.api.data.EmployeeEntity',
    query: JSON.stringify({
      statements: statements || [{'query': '*'}],
      start: start || 0,
      limit: limit || 10 //5000
    })
  };

  https.get({
    hostname: 'e3s.epam.com',
    path: '/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?' + querystring.stringify(queryParameters),
    method: 'GET',
    auth: auth.credentials.username + ':' + auth.credentials.password
  }, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      callback(JSON.parse(data));
    });
  });
}

exports.syncCandidates = function() {
  getItems(auth, EMPLOYEE_ENTITY_TYPE,[{"query":"Available Now","fields":["availabilitySum"]}], null, null,
      function(data) {
        console.log('Synced candidates');
        cacheService.cacheCandidates(mapPersons(data));
      });
};

exports.syncPositions = function() {
  getItems(auth, POSITION_ENTITY_TYPE, [
    {"query":"Position","fields":["reqtype"]},
    {"query":"Open","fields":["stateSum"]}], null, null,
      function(data) {
        console.log('Synced positions');
        cacheService.cachePositions(mapPositions(data));
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
        expert: (person.skill.expert || '').split(", "),
        advanced: (person.skill.advanced || '').split(", "),
        intermediate: (person.skill.intermediate || '').split(", "),
        novice: (person.skill.novice || '').split(", ")
      },
      positions: getCandidateTakenPositions(person),
      projects: getCandidateProjects(person),
      photoId: getCandidatePhotoId(person)
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
      id: position.id
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
}

function getCandidatePhotoId(person) {
  if (person.photosSum && person.photosSum.length) {
    return person.photosSum[0].replace("attachment:\/\/", "");
  }
  return '';
}

function getFirstItemIfArray(array) {
  if (array.length) {
    return array[0];
  }
  return array;
}
