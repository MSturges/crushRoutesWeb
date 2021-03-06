(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('PermissionService', PermissionService)

  PermissionService.$inject = [
    '$q',
    '$http',
    '$window',
    'HostService'
  ];

  function PermissionService ($q, $http, $window, HostService) {

    this.checkTokenValidity = function() {
      var deferred = $q.defer();
      if ($window.localStorage.getItem('token')) {
        $http.post(HostService.api + '/auth/checkTokenValidity', { token: $window.localStorage.getItem('token'), user:  $window.localStorage.getItem('user') })
        .then(function(response) {
          if (response.data.success) {
            deferred.resolve(true);
          } else if(response.data.error){
            deferred.reject(response.data.error);
          }
        })
      } else {
        deferred.reject('Please sign in');
      }
      return deferred.promise;
    }
  }

}())
