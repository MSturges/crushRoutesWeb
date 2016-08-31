(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('ReviewService', ReviewService)

  ReviewService.$inject = [
    '$q',
    '$http',
    'PermissionService',
    '$window',
    'HostService'
  ];

  function ReviewService ($q, $http, PermissionService, $window, HostService) {

    this.grabClimbingAreas = function() {
      var deferred = $q.defer();
      $http.get(HostService.api + '/listClimbing')
      .then(function(success){
        deferred.resolve(success)
      })
      .catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }


    this.grabRoutes = function(area) {
      var deferred = $q.defer();
      $http.post(HostService.api + '/grabRoutes', { climbing_area: area } )
      .then(function(success){
        deferred.resolve(success)
      })
      .catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    this.grabRouteReviews = function(route) {
      var deferred = $q.defer();
      $http.post(HostService.api + '/grabRouteReviews', { route: route } )
      .then(function(success){
        deferred.resolve({
          route_id: success.data.route_id,
          title: success.data.route_name,
          reviews: success.data.reviews,
          picture_url: success.data.picture_url,
          climb_type: success.data.climb_type,
          climb_grade: success.data.climb_grade,
          rating: success.data.rating,
          description: success.data.description,
          reviewTab: true
        })
      })
      .catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    this.submitReview = function(formData, routeId) {
      var deferred = $q.defer();
      PermissionService.checkTokenValidity()
      .then(function(result){
        console.log('result in permission submitReview', result);
        if (result) {
          $http.post(HostService.api + '/submitReview', {
            formData: formData,
            routeId: routeId,
            user_id: JSON.parse($window.localStorage.getItem('user')).id
          })
          .then(function (response){
            if (response.data.error) {
              console.log('in reject', response);
              deferred.reject(response.data.error);
            } else {
              deferred.resolve(response);
            }
          })
        }
      })
      .catch(function(err) {
        alert('You must be logged in to submit a review!')
        deferred.reject(err);
      })
      return deferred.promise;
    }

  }
}())
