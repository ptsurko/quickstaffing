angular.module('QuickStaffing')
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common.Authorization = 'Basic ' + btoa("xxx:yyy");
    $httpProvider.defaults.headers.common.withCredentials = true;
  }])
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://e3s.epam.com/**']);
  }]);
