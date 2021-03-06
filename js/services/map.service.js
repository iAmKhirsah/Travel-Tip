export const mapService = {
  initMap,
  addMarker,
  panTo,
};
import { locService } from './loc.service.js';
import { appController } from '../app.controller.js';
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    userClick();
    userInput();
    // console.log('Map!', gMap);
  });
}

function userClick() {
  gMap.addListener('click', (mapsMouseEvent) => {
    let pos = {
      lat: mapsMouseEvent.latLng.lat(),
      lng: mapsMouseEvent.latLng.lng(),
    };
    axios(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${mapsMouseEvent.latLng.lat()},${mapsMouseEvent.latLng.lng()}&key=AIzaSyAQ_OtORbNSx-qcNp0UH-WlQf22Ht_P4Mg`
    ).then((data) => {
      var locName = data.data.results[0].formatted_address;
      if (!locName) {
        locName = 'Unavailable';
      }
      locService.addLoc(locName, pos.lat, pos.lng);
      appController.onGetLocs();
    });
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${pos.lat}&lon=${pos.lng}&units=metric&appid=9efaf3cc2ecf42bee9225c99caf69523`
      )
      .then((weather) => {
        /// TODO ADD THE WEATHER TO THE THING
        console.log(weather.data.main.temp);
      });
    gMap.setCenter(pos);
    addMarker(pos);
  });
}

function userInput() {
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);
  gMap.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
  gMap.addListener('bounds_changed', () => {
    searchBox.setBounds(gMap.getBounds());
  });
  let markers = [];
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log('Returned place contains no geometry');
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      let position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      addMarker(position);
      locService.addLoc(place.name, position.lat, position.lng);
      appController.onGetLocs();
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    gMap.fitBounds(bounds);
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  addMarker(laLatLng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyAQ_OtORbNSx-qcNp0UH-WlQf22Ht_P4Mg';
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}
