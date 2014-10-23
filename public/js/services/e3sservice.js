angular.module('QuickStaffing')
  .service('e3sservice', function($http) {

    var E3S_URL = 'https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts';
    var PROJECT_ENTITY_TYPE = 'com.epam.e3s.app.project.api.data.ProjectProjectionEntity';
    var EMPLOYEE_ENTITY_TYPE = 'com.epam.e3s.app.people.api.data.EmployeeEntity';

    //https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.people.api.data.EmployeeEntity&query={"statements":[{"query":"*"}],"filters":[{"field":"availabilitySum","values":["Available Now"]}],"start":0,"limit":10}
    //https://e3s.epam.com/rest/e3s-eco-scripting-impl/0.1.0/data/searchFts?type=com.epam.e3s.app.project.api.data.EmployeeEntity&query={"statements":{"query":"*"},"filters":{"field":"availabilitySum","values":["Available Now"]},"start":0,"limit":5000}


    function generateQuery(statements, filters, start, limit) {
      return {
        'statements': [statements || {}],
        'filters': [filters || {}],
        'start': start || 0,
        'limit': limit || 5000
      };
    };

    this.getCandidates = function(availabilitySum, callback) {
      $http({
        method: 'GET',
        url: E3S_URL,
        params: {
          type: EMPLOYEE_ENTITY_TYPE,
          query: JSON.stringify(generateQuery({'query': '*'}, {"field":"availabilitySum","values":["Available Now"]}))
        }
      }).success(function(data) {
          debugger
          callback(null, data);
        })
        .error(function(data, status) {
          debugger
          //TODO: add loading from cache
          callback(status);
        });
    };

    this.getPositions = function() {

    };
  });
