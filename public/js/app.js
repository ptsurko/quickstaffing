angular.module('QuickStaffing', []).
    service('e3sservice', E3SService).
    service('rankservice', RankService).
    service('positionservice', PositionService).
    service('candidateservice', CandidateService).
    controller('IndexController', IndexController);
