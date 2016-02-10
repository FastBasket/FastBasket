angular.module('fastBasket.finish', [])
.controller('finishController', function($scope, $http, $rootScope, $state, $stateParams, mySocket){
  $scope.message = "We received your order from Whole Foods";

  var orderId = localStorage.getItem("orderid");
  mySocket.emit('create', orderId);

  $http({
    method: "GET",
    url: '/api/order/getOrderStatus/' + orderId,
  })
  .then(function(status){
    if (status.data === 'ready') {
      doneOrderReceived();
    } else if (status.data === 'inProgress') {
      doneOrderReceived();
      doneInProgress();
    } else if (status.data === 'delivered') {
      doneOrderReceived();
      doneInProgress();
      doneOntheWay();
    }
  });

  $scope.modeOrderReceived = "indeterminate";
  $scope.showOrderReceived = true;
  $scope.modeInProgress = "indeterminate";
  $scope.showInProgress = false;
  $scope.modeOntheWay = "indeterminate";
  $scope.showOntheWay = false;

  var doneOrderReceived = function(){
    $scope.modeOrderReceived = "determinate";
    $scope.showInProgress = true;
    $scope.message = "Your order is in the works";
  };

  var doneInProgress = function(){
    $scope.modeInProgress = "determinate";
    $scope.showOntheWay = true;
    $scope.message = "Your Driver Ron is on the way";
  };

  var doneOntheWay = function(){
    $scope.modeOntheWay = "determinate";
    $scope.message = "Order Delivered";
  };

  mySocket.on('doneOrderReceived', function (data) {
    doneOrderReceived();
  });

  mySocket.on('doneInProgress', function (data) {
    doneInProgress();
  });

  mySocket.on('doneOntheWay', function (data) {
    doneOntheWay();
  });

  mySocket.on('updatePositions', function(data){
    var driverPosition;
    for (var i=0; i<data.length; i++){
      driverPosition = JSON.parse(data[i]);
      if (driverPosition.orders){
        for (var j=0; j<driverPosition.orders.length; j++){
          if (driverPosition.orders[j].id === orderId){
            loadMap([driverPosition]);
            break;
          }
        }
      }
    }
  });

//--------------------------Driver Start----------------------------------------------------
var mapTooltipsJS;
var myLayer;

L.mapbox.accessToken = 'pk.eyJ1IjoiY3BlbmFycmlldGEiLCJhIjoiY2lrN2l1cG5vMDF0eHY0a3RiODJ2aGJ0bSJ9.fAuGhHCAg4Z98unqNzUaEg';
mapTooltipsJS = L.mapbox.map('map-tooltips-js', 'mapbox.streets').setView([37.7836966, -122.4089664], 11)
myLayer = L.mapbox.featureLayer().addTo(mapTooltipsJS);

var loadMap = function(driverLocations){
  var fitBoundsArray = [];
  //Object coming from redis: ["{"lat":37.7837156,"lon":-122.40927529999999,"id":"5"}", "{"lat":37.7837156,"lon":-122.40927529999999,"id":"4"}"]
  //create new array to store parsed redis value
  var driverLocations = driverLocations;
  console.log("here are the new Driver Locations: ", driverLocations)
  //create a geojson array
  var geojson = [];
  //take redis object and loop over it, parse each value and create a new key for long, lat, and add it gejson object)
  for (var i = 0 ; i < driverLocations.length ; i++){
    var parsedDriverLocation = driverLocations[i];

    var coords = [parsedDriverLocation.lon,parsedDriverLocation.lat];
    var fitBoundsCoords = [parsedDriverLocation.lat,parsedDriverLocation.lon];
    fitBoundsArray.push(fitBoundsCoords);

    var current = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": coords
      },
      "properties": {
        "icon": {
            "iconUrl": "https://cdn0.iconfinder.com/data/icons/Car_Icon_Set_BevelAndEmboss-Net/54/car.png",
            "iconSize": [40, 20], // size of the icon
            "iconAnchor": [20, 10], // point of the icon which will correspond to marker's location
            "popupAnchor": [0, -20], // point from which the popup should open relative to the iconAnchor
            "className": "dot"
        }
      }
    }
    geojson.push(current);
  }

  var ordersLocationArr = driverLocations[0].orders;
  for (var j=0; j<ordersLocationArr.length; j++){
    var coords = [ordersLocationArr[j].shippingaddresspoint.y, ordersLocationArr[j].shippingaddresspoint.x];
    var fitBoundsCoords = [ordersLocationArr[j].shippingaddresspoint.x, ordersLocationArr[j].shippingaddresspoint.y];
    fitBoundsArray.push(fitBoundsCoords);

    var current = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": coords
      },
      "properties": {
        "icon": {
            "iconUrl": "http://192.185.84.204/~procrc/wp-content/uploads/2014/12/favicon.png",
            "iconSize": [30, 30], // size of the icon
            "iconAnchor": [15, 15], // point of the icon which will correspond to marker's location
            "popupAnchor": [0, -15], // point from which the popup should open relative to the iconAnchor
            "className": "dot"
        }
      }
    }

    if (parseInt(ordersLocationArr[j].id, 10) !== parseInt(orderId, 10)){
      current.properties.icon.iconUrl = "https://www.briarcliff.edu/media/394037/marker.png"
    }

    geojson.push(current);
  }

  mapTooltipsJS.fitBounds(fitBoundsArray);


  // Set a custom icon on each marker based on feature properties.
  myLayer.on('layeradd', function(e) {
    var marker = e.layer,
      feature = marker.feature;
    marker.setIcon(L.icon(feature.properties.icon));
    var content = '<h2>'+ feature.properties.title+'<\/h2>';
    marker.bindPopup(content);
  });
  myLayer.setGeoJSON(geojson);
  mapTooltipsJS.scrollWheelZoom.disable();
};
//--------------------------Driver End  ----------------------------------------------------

});
