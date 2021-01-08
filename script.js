//Taken from the Youtube Channel: Framework Television
var map;
var infowindow;

var request;
var service;
var markers = [];

function initialize() {
  var center = new google.maps.LatLng(1.3316677,103.7742382);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center, //center the map at the requested location
    zoom: 13
  });

  //finds carpark within a 2km radius
  request = {
    location: center,
    radius: 2000,
    types: ['parking']
  };
  infowindow = new google.maps.InfoWindow();

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback); //search for nearby carparks

  //Shows carpark where the user right clicks
  google.maps.event.addListener(map, 'rightclick', function(event) {
    map.setCenter(event.latLng)
    clearResults(markers)

    //finds carpark within a 2km radius
    var request = {
      location: event.latLng,
      radius: 2000,
      types: ['parking']
    };
    service.nearbySearch(request, callback); //search for nearby carparks
  })
}

//ensure everything works fine
function callback(results, status) {
  if(status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i=0; i<results.length; i++) {
      markers.push(createMarker(results[i]));
    }
  }
}

//create markers
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  //display name of carpark
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  return marker;
}

//clear previously right clicked markers
function clearResults(markers) {
  for (var m in markers) {
    markers[m].setMap(null)
  }
  markers = []
}

google.maps.event.addDomListener(window, 'load', initialize);