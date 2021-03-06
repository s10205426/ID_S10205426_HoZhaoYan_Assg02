var map;
var input;

var infowindow;
var place;

var request;
var service;
var markers = [];

var searchCoord;
var searchMarker;

//Parts taken from the Youtube Channel: CodexWorld
//Parts taken from the Youtube Channel: Framework Television
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 1.3316677, lng: 103.7742382},
        zoom: 13
    });
    input = document.getElementById('searchInput');
    
    //autocomplete search
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    infowindow = new google.maps.InfoWindow();

    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function(event) {
      infowindow.close();
      marker.setVisible(false);
      place = autocomplete.getPlace();

      //alerts user when input is not located on the map
      if (!place.geometry) {
        window.alert("No Location Found");
        return;
      }

      //present on map if input is located on the map
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(13);
      }
      
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      searchCoord = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
      clearResults(markers)

      map = new google.maps.Map(document.getElementById('map'), {
        center: searchCoord,
        zoom: 13
      });

      //place a marker at the searched location
      searchMarker = new google.maps.Marker({
        map: map,
        position: searchCoord,
      });

      //create a radius around the searched location
      var circle = new google.maps.Circle({
        map: map,
        radius: 1000,
        fillColor: '#ADD8E6'
      });
      circle.bindTo('center', searchMarker, 'position');

      //finds carpark within a 2km radius
      request = {
        location: searchCoord,
        radius: 1000,
        types: ['parking']
      };
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback); //search for nearby carparks

    });
}

//places markers on the map
function callback(results, status) {
  if(status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i=0; i<results.length; i++) {
      markers.push(createMarker(results[i]));
    }
  }
}
  
//create markers
function createMarker(place) {
  marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  //display name of carpark
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  return marker;
}

//clear previously created markers
function clearResults(markers) {
  for (var m in markers) {
    markers[m].setMap(null)
  }
  markers = []
}

google.maps.event.addDomListener(window, 'load', initMap);
