angular.module('QuickStaffing')
  .controller('IndexController', ['$scope', 'e3sservice', function($scope, e3sservice) {
    e3sservice.getCandidates(function() {
      debugger
    });
  }]);
