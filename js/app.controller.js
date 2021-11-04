import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
export const appController = {
  onGetLocs,
};

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLoc = onDeleteLoc;
window.copyToClipboard = copyToClipboard;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      // console.log('Map is ready', gMap);
      queryString();
    })
    mapService.askWeather()
    .catch(() => console.log('Error: cannot init map'));
  locService.getLocs().then((locations) => {
    onGetLocs();
  });
}

function queryString() {
  let aURL = new URL(location.href);
  let lat = aURL.searchParams.get('lat');
  let lng = aURL.searchParams.get('lng');
  if (lat === 0 && lng === 0) {
    lat = 32.0749831;
    lng = 34.9120554;
  }
  console.log(+lat, +lng);
  onPanTo(+lat, +lng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  // console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    // console.log('Locations:', locs);
    var strHtml = locs.map((location) => {
      return `<div class="location-row"> Name: ${location.name} , lat:${location.lat}, lang:${location.lng} </div><button onclick="onPanTo(${location.lat},${location.lng})">Go</button><button onclick="copyToClipboard(${location.lat},${location.lng})">Copy</button><button onclick="onDeleteLoc('${location.name}')">Delete</button> `;
    });

    document.querySelector('.locs').innerHTML = strHtml.join('');
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      // console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}
function onPanTo(lng, lat) {
  // console.log('Panning the Map');
  mapService.panTo(lng, lat);
}

function onDeleteLoc(locName) {
  console.log(locName);
  locService.findLocIdxByName(locName);
  onGetLocs();
}

function copyToClipboard(lat, lng) {
  var link = `https://iamkhirsah.github.io/Travel-Tip/?lat=${lat}&lng=${lng}`;
  navigator.clipboard.writeText(link);
}
