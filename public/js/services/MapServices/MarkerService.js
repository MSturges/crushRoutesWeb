(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('MarkerService', MarkerService)

  MarkerService.$inject = [
    '$log',
    '$q',
    '$http',
    'PermissionService',
    '$window',
    'HostService'
  ];

  function MarkerService ($log, $q, $http, PermissionService, $window, HostService) {

    this.getMarkers = function() {
      var deferred = $q.defer();
      $http.get(HostService.api + '/allmarkers')
      .then(function(markers){
        console.log('MARKERS', markers);
        deferred.resolve(markers.data);
      })
      .catch(function(err){
        deferred.reject(err);
      })
      return deferred.promise;
    },

    this.addMarker = function(markerObj){
      var deferred = $q.defer();
      PermissionService.checkTokenValidity()
      .then(function(result){
        if (result) {
          $http.post(HostService.api + '/addMarker', {
            markerObj: markerObj,
            user_id: JSON.parse($window.localStorage.getItem('user')).id
          })
          .then(function(success){
            deferred.resolve(success)
          })
        } else {
          deferred.reject(result);
        }
      })
      .catch(function(err) {
        console.log('ERR', err);
        deferred.reject(err);
      })

      return deferred.promise;
    }
  }
}())
