var E3SService = function($http) {
  this.http_ = $http;
};

E3SService.API_GET_CANDIDATES = '/api/candidates';
E3SService.API_GET_POSITIONS = '/api/positions';

E3SService.prototype.getCandidates = function() {
  return this.http_.get(E3SService.API_GET_CANDIDATES).
      then(this.onSuccess_, this.onError_);
};

E3SService.prototype.getPosition = function() {
  return this.http_.get(E3SService.API_GET_POSITIONS).
      then(this.onSuccess_, this.onError_);
};

E3SService.prototype.onSuccess_ = function(response) {
  return response.data;
};

E3SService.prototype.onError_ = function(err) {
  throw new Error('Error during get request');
};
