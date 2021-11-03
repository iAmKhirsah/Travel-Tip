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
window.onUpdateLoc = onUpdateLoc;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      // console.log('Map is ready', gMap);
    })
    .catch(() => console.log('Error: cannot init map'));
  locService.getLocs().then((locations) => {
    onGetLocs();
  });
  queryString();
}
/// CHECK WHERE TO PUT IT, SINCE IT HAPPENS BEFORE MAP LOAD

function queryString() {
  let aURL = new URL(location.href);
  let lat = aURL.searchParams.get('lat');
  let lng = aURL.searchParams.get('lng');
  // console.log(+lat, +lng);
  onPanTo(+lat, +lng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  // console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  // console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    // console.log('Locations:', locs);
    var strHtml = locs.map((location) => {
      return `<div> Name:${location.name} ,lat:${location.lat}, lang:${location.lng} </div><button onclick="onPanTo(${location.lat},${location.lng})">Go</button><button onclick="onUpdateLoc(this)">Update</button><button onclick="onDeleteLoc('${location.name}')">Delete</button> `;
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
  mapService.panTo(lat, lng);
}

function onDeleteLoc(locName) {
  console.log(locName);
  locService.findLocIdxByName(locName);
  onGetLocs();
}

function onUpdateLoc(something) {
  console.log(something);
}
