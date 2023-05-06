import { PrismaClient } from '@prisma/client';
import ObjectID from "bson-objectid"

import fs from 'fs';

//read data file
const data = require('./data.json');
interface LocationData {
  geometry: string;
  coordinates: number[];
  area: number;
  type: string;
  name: string;
  dataId: string;
}

const client = new PrismaClient();

const main = async () => {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object') { // Vérifiez que `value` est un objet
      const locationData: LocationData = value as LocationData;
      const location = await client.location.create({
        data: {
          id: ObjectID().toHexString(),
          geometry: 'Point',
          coordinates: locationData.coordinates,
          type: locationData.type,
          name: locationData.name,
          area: locationData.area,
        },
      });
      data[key].id = location.id;
      console.log(location);
    }
  }
  // save data file
  fs.writeFileSync('./data_inserted.json', JSON.stringify(data, null, 2));

};

main();
