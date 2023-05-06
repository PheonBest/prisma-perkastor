// open json file
const data = require('./citiesv3.json');


// Parcourir le dictionnaire
for (const [key, value] of Object.entries(data)) {
    console.log(`Key: ${key}, Value: ${value}`);
    break;
}
