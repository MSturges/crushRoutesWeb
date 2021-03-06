(function() {
  'use strict';

  angular.module('crushingRoutes')
  .controller('MapController', MapController)

  MapController.$inject = [
    '$scope',
    '$rootScope',
    'MarkerService',
    'ReviewService',
    'FilterMarkerService',
    'LeafletConfigService',
    'IPService',
    '$state',
    '$http',
    '$mdDialog'
  ]
  function MapController ($scope, $rootScope, MarkerService, ReviewService, FilterMarkerService, LeafletConfigService, IPService, $state, $http, $mdDialog) {
    $scope.defaults = LeafletConfigService.defaults;
    $scope.center_boulder = LeafletConfigService.center_boulder;
    $scope.layers = LeafletConfigService.layers;
    $scope.boulder = {};
    $scope.events = {};
    $scope.rock = {};
    $scope.ice = {};
    $scope.filter = {boulder_grade_min: 'v0', boulder_grade_max: 'v16',rock_grade_min: '5.0',rock_grade_max: '5.15d',ice_grade_min: 'WI1',ice_grade_max: 'AI6'};
    $scope.markers = [];
    $scope.filteredMarkerArr = [];
    $scope.ip = "";
    $scope.boulder.min = ('v0 v1 v2 v3 v4 v5 v6 v7 v8 v9 v10 v11 v12 v13 v14 v15 v16').split(' ').map(function (grade) { return { abbrev: grade }; });
    $scope.boulder.max = ('v0 v1 v2 v3 v4 v5 v6 v7 v8 v9 v10 v11 v12 v13 v14 v15 v16').split(' ').map(function (grade) { return { abbrev: grade }; });
    $scope.rock.min = ('5.0 5.1 5.2 5.3 5.4 5.5 5.6 5.7 5.8 5.9 5.10a 5.10b 5.10c 5.10d 5.11a 5.11b 5.11c 5.11d 5.12a 5.12b 5.12c 5.12d 5.13a 5.13b 5.13c 5.13d 5.14a 5.14b 5.14c 5.14d 5.15a 5.15b 5.15c 5.15d').split(' ').map(function (grade) { return { abbrev: grade }; });
    $scope.rock.max = ('5.0 5.1 5.2 5.3 5.4 5.5 5.6 5.7 5.8 5.9 5.10a 5.10b 5.10c 5.10d 5.11a 5.11b 5.11c 5.11d 5.12a 5.12b 5.12c 5.12d 5.13a 5.13b 5.13c 5.13d 5.14a 5.14b 5.14c 5.14d 5.15a 5.15b 5.15c 5.15d').split(' ').map(function (grade) { return { abbrev: grade }; });
    $scope.ice.min = ('WI1 WI2 WI3 WI4 WI5 WI6 WI7 WI8 AI1 AI2 AI3 AI4 AI5 AI6').split(' ').map(function (grade) { return { abbrev: grade }; });
    $scope.ice.max = ('WI1 WI2 WI3 WI4 WI5 WI6 WI7 WI8 AI1 AI2 AI3 AI4 AI5 AI6').split(' ').map(function (grade) { return { abbrev: grade }; });

    $scope.searchIP = function(ip) {
      IPService.searchIP(ip)
      .success(function(res) {
        $scope.center_boulder = { lat: res.latitude, lng: res.longitude, zoom: 12 };
        $scope.ip = res.ip;
      });
    };

    // responding to a change in the filter dropdowns
    $scope.$watch(function(){
      return $scope.filter
    }, function(updatedFilterSettings) {
      // when page first loads draw all markers
      if($scope.markers.length === 0) {
        MarkerService.getMarkers()
        .then(function(markers){
          // hold onto orignal markers
          $scope.markers = markers;
          // because we don't need to filter yet set filteredMarkerArr to all markers
          $scope.filteredMarkerArr = $scope.markers;
        })
      } else {
        // if real filter is applied - run filter on markers
        $scope.filteredMarkerArr = $scope.markers.filter(function(marker) {
          // if this function returns true then the marker is good and in range
          if (FilterMarkerService.markerInRange(marker.type, marker, updatedFilterSettings)) {
            return marker;
          }
        })
      }
      // check for deep equality and makes sure $scope.$watch is ran for every change of $scope.filter
    }, true)

    // Listens to a click envent to add marker
    $scope.$on("leafletDirectiveMap.click", function(event, args){
      window.scrollTo(0, 0);
      var leafEvent = args.leafletEvent;
      $rootScope.$broadcast('populateAndOpenSideNav', leafEvent);
      $scope.filteredMarkerArr.push({
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng,
        focus: true,
        message: 'New Route',
        icon:  {
          iconUrl: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Ball-Azure-icon.png',
          iconSize: [55, 55] // size of the icon
        }
      });
    });

    // responding to a submission of a new marker or a close of the sidenav
    // redraw markers on close
    $rootScope.$on('redrawMarkers', function(event, leafEvent) {
      MarkerService.getMarkers()
      .then(function(markers){
        $scope.markers = markers;
        $scope.filteredMarkerArr = $scope.markers.filter(function(marker) {
          if (FilterMarkerService.markerInRange(marker.type, marker, $scope.filter)) {
            return marker;
          }
        })
      })
      .catch(function(err){
        console.log('markers', err);
      })
    });

    $scope.mapClass = function(visible){
      return visible ? 'shownMap' : 'hiddenMap';
    }

    $scope.showMap = true;
    $scope.checkRoute = function() {
      if ($rootScope.currentNavItem === 'home') {
        $scope.showMap = true;
      } else {
        $scope.showMap = false;
      }
      return $scope.showMap
    }

    setTimeout(function() {
      ReviewService.grabClimbingAreas()
      .then(function(res){
        $scope.getShitDone = res.data;
      })
      .catch(function(err){
        console.log(err);
      })
    }, 500);

    function openRoutes() {
      $mdDialog.show(
        $mdDialog.alert({
          controller: mdDialogCtrl,
          templateUrl: '../../templates/modal_templates/routes_template.html',
          locals:{currentModalItem: $scope.currentModalItem}
        })
        .clickOutsideToClose(true)
        .escapeToClose(true)
      ).finally(function(){
        var body = document.body;
        body.style.overflow = 'scroll';
        info.style.display = 'block';
      });
    }

    var tabs = [{title: 'Routes', mainTab: true}]

    $scope.currentModalItem;

    var mdDialogCtrl = function ($scope, currentModalItem) {
      $scope.currentModalItem = currentModalItem;
      $scope.tabs = tabs;
      $scope.selectedIndex = 0;
      $scope.leaveComment = false;

      $scope.submitReview = function(formData, routeId) {
        ReviewService.submitReview(formData, routeId)
        .then(function(sucess){
          $scope.tabs = [$scope.tabs[0]];
        })
      }

      $scope.checkTabs = function(tab) {
        if (tab.mainTab) {
          $scope.tabs = [$scope.tabs[0]];
        }
      }

      $scope.openSingleRouteTab = function(route) {
        $scope.tabs = [$scope.tabs[0]];
        ReviewService.grabRouteReviews(route)
        .then(function(success) {
          $scope.tabs.push(success)
          $scope.selectedIndex = 1;
        })
      }
    }

    $scope.openFromLeft = function(item) {
      var body = document.body;
      var info = document.body.querySelector('.leaflet-control-attribution');
      body.style.overflow = 'hidden';
      info.style.display = 'none';
      $scope.currentModalItem = item;

      ReviewService.grabRoutes($scope.currentModalItem.climbing_area)
      .then(function(res){
        $scope.currentModalItem.routesForArea = res.data;
      })
      openRoutes();
    };
  }
}())
