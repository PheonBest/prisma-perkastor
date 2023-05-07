import { PrismaClient } from '@prisma/client';
import ObjectID from 'bson-objectid';
import fs from 'fs';

const client = new PrismaClient();
interface LocationData {
    geometry: string;
    coordinates: number[];
    area: number;
    type: string;
    name: string;
    dataId: string;
  }
  
  interface LocationToInsert {
    id: string;
    geometry: string;
    coordinates: number[];
    type: string;
    name: string;
    area: number;
  }
  
//add a new location
const addLocation = async (location: LocationToInsert) => {
    const newLocation = await client.location.create({
        data: location,
    });
    return newLocation;
};

const newLoc = await addLocation({
    id: ObjectID().toHexString(),
    geometry: 'Point',
    coordinates: [4.872777777777778, 45.7830556],
    type: 'rue',
    name: 'Campus de la Doua',
    area: 1,
    
})
// dataId : "Q3208343"
// objectID : 645780826b82b11a682240f8
console.log(newLoc);

const newLoc2 = await addLocation({
    id: ObjectID().toHexString(),
    geometry: 'Point',
    coordinates: [4.872777777777778, 45.7830556],
    type: 'rue',
    name: 'INSA Lyon',
    area: 0.3,
// dataId : "Q1633859"
// objectID : 645780826b82b11a682240f9
})
console.log(newLoc2);