(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('HostService', HostService)

  HostService.$inject = [

  ];

  function HostService () {
    var hostArr = window.location.origin.split(':');
    this.api = hostArr[hostArr.length-1] === '8080' ? 'http://localhost:3000' : 'https://crushroutesapi.herokuapp.com/';
  }
}())
