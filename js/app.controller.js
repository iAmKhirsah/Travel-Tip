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

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready', gMap);
    })
    .catch(() => console.log('Error: cannot init map'));
  locService.getLocs().then((locations) => {
    onGetLocs();
  });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    var strHtml = locs.map((location) => {
      return `<div> Name:${location.name} ,lat:${location.lat}, lang:${location.lng} </div><button onclick="onPanTo(${location.lat},${location.lng})">Go</button><button onclick="onDeleteLoc('${location.name}')">Delete</button> `;
    });

    document.querySelector('.locs').innerHTML = strHtml.join('');
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
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
  console.log('Panning the Map');
  mapService.panTo(lat, lng);
}

function onDeleteLoc(locName) {
  console.log(locName);
  locService.findLocIdxByName(locName);
  onGetLocs();
}
