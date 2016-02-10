angular.module('fastBasket.map', [])
.controller('mapController', function($scope, $http, $rootScope, $state, shopCart, mySocket){
  L.mapbox.accessToken = 'pk.eyJ1IjoiY3BlbmFycmlldGEiLCJhIjoiY2lrN2l1cG5vMDF0eHY0a3RiODJ2aGJ0bSJ9.fAuGhHCAg4Z98unqNzUaEg';
  var mapTooltipsJS = L.mapbox.map('map-tooltips-js', 'mapbox.streets')
    .setView([37.8, -96], 10)
  var myLayer = L.mapbox.featureLayer().addTo(mapTooltipsJS);

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
    var parsedDriverLocation = JSON.parse(driverLocations[i]);

    var coords = [parsedDriverLocation.lon,parsedDriverLocation.lat];
    var fitBoundsCoords = [parsedDriverLocation.lat,parsedDriverLocation.lon];
    fitBoundsArray.push(fitBoundsCoords);

    var arrAdd = [];
    for (var j=0; j<parsedDriverLocation.orders.length; j++){
      arrAdd.push(parsedDriverLocation.orders[j].shippingaddress);
    }

    var current = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": coords
      },
      "properties": {
        "title": "Current Job",
        "address": arrAdd,
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

  mapTooltipsJS.fitBounds(fitBoundsArray);


  // Set a custom icon on each marker based on feature properties.
  myLayer.on('layeradd', function(e) {
    var marker = e.layer,
      feature = marker.feature;
    marker.setIcon(L.icon(feature.properties.icon));
    var content = '<h2>'+ feature.properties.title+'<\/h2>';
    content += '<ul>';
    for (var i=0; i<feature.properties.address.length; i++){
      content += "<li>"
      content += feature.properties.address[i];
      content += "<\/li>"
    }
    content += '<\/ul>';
    marker.bindPopup(content);
  });
  myLayer.setGeoJSON(geojson);
  mapTooltipsJS.scrollWheelZoom.disable();
};
  mySocket.on('updatePositions', function(driverLocations){
    console.log('from mapController',driverLocations);
    loadMap(driverLocations);
  });


});
