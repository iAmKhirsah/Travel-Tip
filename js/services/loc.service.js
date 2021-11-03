export const locService = {
  getLocs,
  findLocIdxByName,
};
import { utilService } from './utils.js';
import { storageService } from './storage.service.js';

const locs = [];
function getLocs() {
  return new Promise((resolve, reject) => {
    var locations = storageService.loadFromStorage('locations');
    if (locations) {
      console.log('from storage');
      resolve(locations);
    } else {
      console.log('from here');
      resolve(locs);
      storageService.saveToStorage('locations', locs);
    }
  });
}

function findLocIdxByName(name) {
  var index = locs.findIndex((location) => {
    return name === location.name;
  });
  _deleteLoc(index);
}
function _deleteLoc(index) {
  locs.splice(index, 1);
}
