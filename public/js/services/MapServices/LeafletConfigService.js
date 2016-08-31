(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('LeafletConfigService', LeafletConfigService)

  LeafletConfigService.$inject = [

  ];

  function LeafletConfigService () {
    this.defaults = { zoomControl: false };
    this.center_boulder = { lat: 40.015, lng: -105.27, zoom: 13 };
    this.layers = {
      baselayers: {
        googleHybrid: {
          name: 'Google Hybrid',
          layerType: 'HYBRID',
          type: 'google'
        },
        googleTerrain: {
          name: 'Google Terrain',
          layerType: 'TERRAIN',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        }
      }
    };
  }
  
}())
