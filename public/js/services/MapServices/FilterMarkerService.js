(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('FilterMarkerService', FilterMarkerService)

  FilterMarkerService.$inject = [

  ];

  function FilterMarkerService () {

    var rockScale = { '5.0': 1, '5.1': 2, '5.2': 3, '5.3': 4, '5.4': 5, '5.5': 6, '5.6': 7, '5.7': 8, '5.8': 9, '5.9': 10, '5.10a': 11,'5.10b': 12, '5.10c': 13, '5.10d': 14, '5.11a': 15, '5.11b': 16, '5.11c': 17, '5.11d': 18, '5.12a': 19, '5.12b': 20, '5.12c': 21, '5.12d': 22, '5.13a': 23, '5.13b': 24, '5.13c': 25, '5.13d': 26, '5.14a' : 27, '5.14b': 28, '5.14c': 29, '5.14d': 30, '5.15a': 31, '5.15b': 32, '5.15c': 33, '5.15d': 34 }
    var boulderScale = { 'v0': 1, 'v1': 2, 'v2': 3, 'v3': 4, 'v4': 5, 'v5': 6, 'v6': 7, 'v7': 8, 'v8': 9, 'v9': 10, 'v10': 11, 'v11': 12, 'v12': 13, 'v13': 14, 'v14': 15, 'v15': 16, 'v16': 17 }
    var iceScale = { 'WI1': 1, 'WI2': 2, 'WI3': 3, 'WI4': 4, 'WI5': 5, 'WI6': 6, 'WI7': 7, 'WI8': 8, 'AI1': 9, 'AI2': 10, 'AI3': 11, 'AI4': 12, 'AI5': 13, 'AI6': 14 }

    this.markerInRange = function(type, marker, settings) {
      switch (type) {
        case 'Rock':
        var markerValue = rockScale[marker.grade]
        var lowerScale = rockScale[settings.rock_grade_min]
        var upperScale = rockScale[settings.rock_grade_max]
        if (markerValue >= lowerScale && markerValue <= upperScale) {
          return true;
        } else {
          return false;
        }
        break;
        case 'Boulder':
        var markerValue = boulderScale[marker.grade]
        var lowerScale = boulderScale[settings.boulder_grade_min]
        var upperScale = boulderScale[settings.boulder_grade_max]
        if (markerValue >= lowerScale && markerValue <= upperScale) {
          return true;
        } else {
          return false;
        }
        break;
        case 'Ice':
        var markerValue = iceScale[marker.grade]
        var lowerScale = iceScale[settings.ice_grade_min]
        var upperScale = iceScale[settings.ice_grade_max]
        if (markerValue >= lowerScale && markerValue <= upperScale) {
          return true;
        } else {
          return false;
        }
        break;
        default:
        return true;
      }
    }

  }

}())
