angular.module('fastBasket.map', [])
.controller('mapController', function($scope, $http, $rootScope, $state, shopCart, mySocket){
  L.mapbox.accessToken = 'pk.eyJ1IjoiY3BlbmFycmlldGEiLCJhIjoiY2lrN2l1cG5vMDF0eHY0a3RiODJ2aGJ0bSJ9.fAuGhHCAg4Z98unqNzUaEg';
  var mapTooltipsJS = L.mapbox.map('map-tooltips-js', 'mapbox.streets')
    .setView([37.8, -96], 10)
    .fitBounds([[
            58.775408,
            -123.413682
        ], [
            37.775408,
            -122.413682
        ]]);
  var myLayer = L.mapbox.featureLayer().addTo(mapTooltipsJS);

  var geojson = [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-123.413682,58.775408]
      },
      "properties": {
        "title": "Mapbox DC",
        "description": "1714 14th St NW, Washington DC",
        "image": "https://farm9.staticflickr.com/8604/15769066303_3e4dcce464_n.jpg",
        "icon": {
            "iconUrl": "https://cdn0.iconfinder.com/data/icons/Car_Icon_Set_BevelAndEmboss-Net/54/car.png",
            "iconSize": [40, 20], // size of the icon
            "iconAnchor": [20, 10], // point of the icon which will correspond to marker's location
            "popupAnchor": [0, -20], // point from which the popup should open relative to the iconAnchor
            "className": "dot"
        }
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.413682,37.775408]
      },
      "properties": {
        "title": "Mapbox SF",
        "description": "155 9th St, San Francisco",
        "image": "https://farm9.staticflickr.com/8571/15844010757_63b093d527_n.jpg",
        "icon": {
            "iconUrl": "https://cdn0.iconfinder.com/data/icons/Car_Icon_Set_BevelAndEmboss-Net/54/car.png",
            "iconSize": [40, 20], // size of the icon
            "iconAnchor": [20, 10], // point of the icon which will correspond to marker's location
            "popupAnchor": [0, -20], // point from which the popup should open relative to the iconAnchor
            "className": "dot"
        }
      }
    }
  ];

  // Set a custom icon on each marker based on feature properties.
  myLayer.on('layeradd', function(e) {
    var marker = e.layer,
      feature = marker.feature;
    marker.setIcon(L.icon(feature.properties.icon));
    var content = '<h2>'+ feature.properties.title+'<\/h2>' + '<img src="'+feature.properties.image+'" alt="">';
    marker.bindPopup(content);
  });
  myLayer.setGeoJSON(geojson);
  mapTooltipsJS.scrollWheelZoom.disable();

  mySocket.on('updatePositions', function(data){
    console.log(data);
  });


});
