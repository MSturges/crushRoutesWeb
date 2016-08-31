(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('IPService', IPService)

  IPService.$inject = [
    '$http'
  ];

  function IPService ($http) {

    this.searchIP = function(ip) {
      var url = "https://freegeoip.net/json/" + ip;
      return $http.get(url);
    };

  }

}())
