var cache = {};

var E3SService = function($http, $q) {
  this.http_ = $http;
  this.q_ = $q;
};

E3SService.API_GET_CANDIDATES = '/api/candidates';
E3SService.API_GET_POSITIONS = '/api/positions';

E3SService.prototype.getCandidates = function() {
  if (cache.candidates) {
    var deferred = this.q_.defer();
    deferred.resolve(cache.candidates);
    return deferred.promise;
  }
  return this.http_.get(E3SService.API_GET_CANDIDATES).
      then(this.onSuccess_, this.onError_);
};

E3SService.prototype.getPositions = function() {
  if (cache.positions) {
    var deferred = this.q_.defer();
    deferred.resolve(cache.positions);
    return deferred.promise;
  }
  return this.http_.get(E3SService.API_GET_POSITIONS).
      then(this.onSuccess_, this.onError_);
};

E3SService.prototype.onSuccess_ = function(response) {
  return response.data;
};

E3SService.prototype.onError_ = function(err) {
  throw new Error('Error during get request');
};
