var https = require('https'),
    querystring = require('querystring'),
    fs = require('fs');

var PROJECT_ENTITY_TYPE = 'com.epam.e3s.app.project.api.data.ProjectProjectionEntity';
var EMPLOYEE_ENTITY_TYPE = 'com.epam.e3s.app.people.api.data.EmployeeEntity';
var POSITION_ENTITY_TYPE = 'com.epam.e3s.app.position.api.data.PositionProjectionEntity';

//https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={"statements":[{"query":"Available Now","fields":["availabilitySum"]}],"start":0,"limit":10}
//https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.position.api.data.PositionProjectionEntity&query={"statements":[{"query":"Position","fields":["reqtype"]}],"filters":[],"start":0,"limit":10}

//https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.project.api.data.ProjectProjectionEntity&query={"statements":[{"query":"Project", "fields":["typeSum"]},{"query":"Active","fields":["statusSum"]}],"start":0,"limit":10}

function getItems(auth, type, statements, start, limit, callback) {
  var queryParameters = {
    type: type || 'com.epam.e3s.app.people.api.data.EmployeeEntity',
    query: JSON.stringify({
      statements: statements || [{'query': '*'}],
      start: start || 0,
      limit: limit || 1
    })
  };

  https.get({
    hostname: 'e3s.epam.com',
    path: '/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?' + querystring.stringify(queryParameters),
    method: 'GET',
    auth: auth.username + ':' + auth.password
  }, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      console.log(res.statusCode);
      //console.log(data);
      callback(data);
    });
  });
};

exports.getCandidates = function(auth, availabilitySum, callback) {
  getItems(auth, EMPLOYEE_ENTITY_TYPE, [{"query":"Available Now","fields":["availabilitySum"]}], null, null, callback);
};

exports.getPositions = function(auth, callback) {
  getItems(auth, POSITION_ENTITY_TYPE, [{"query":"Position","fields":["reqtype"]}], null, null, callback);
};

exports.getProjects = function(auth, callback) {
  getItems(auth, PROJECT_ENTITY_TYPE, [{"query":"Project", "fields":["typeSum"]},{"query":"Active","fields":["statusSum"]}], null, null, callback)
};
