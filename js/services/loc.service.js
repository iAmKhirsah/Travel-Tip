export const locService = {
    getLocs,
    findLocIdxByName
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
          resolve(locs);
        
    });
}
function findLocIdxByName(name){
   var index = locs.findIndex((location) => {
        return name === location.name

    })
    _deleteLoc(index)

}
function _deleteLoc(index){
    locs.splice(index,1)
    
}


