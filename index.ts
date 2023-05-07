import { PrismaClient } from '@prisma/client';
import ObjectID from 'bson-objectid';
import fs from 'fs';

// Lire le fichier de données
const data = require('./data/persons_prisma.json');

interface PersonData {
  name: string;
  birthDate: string;
  deathDate: string;
  shortDesc: string;
  content: string;
  image: string;
  dataId: string;
}

interface PersonToInsert {
  id: string;
  name: string;
  birthDate: Date;
  deathDate: Date;
  shortDesc: string;
  content: string;
  image: string;
}

const client = new PrismaClient();

const main = async () => {
  const uniquePersons = new Map<string, PersonToInsert>();

  for (const [key, value] of Object.entries<PersonData>(data)) {
    const id = ObjectID().toHexString();
    var birthDate : Date = new Date(value.birthDate)
    var deathDate : Date = new Date(value.deathDate)
    
    uniquePersons.set(key, {
      id: id,
      name: value.name,
      birthDate: birthDate,
      deathDate: deathDate,
      shortDesc: value.shortDesc,
      content: value.content,
      image: value.image,

    });
    data[key].id = id;
    
  }

  try {
    await client.historicalPerson.createMany({
      data: Array.from(uniquePersons.values()),
    });
  } catch (error) {
    console.error('Error inserting data:', error);
  }

  // Enregistrer le fichier de données
  fs.writeFileSync('./historal_persons_inserted.json', JSON.stringify(data, null, 2));
};

main();
/*
fact = await prisma.fact.create({
        "data": {
            "title": "Napoléon envahit la Russie",
            "shortDesc": "En 1812, Napoléon envahit la Russie avec sa Grande Armée.",
            "content": "L'invasion de la Russie par Napoléon en 1812 a marqué un tournant...",
            "from": datetime(1812, 6, 24),
            "until": datetime(1812, 12, 14),
            "banne
            rImg": "https://example.com/napoleon_invasion.jpg",
            "verified": True,
            "video": [],
            "audio": [],
            "author": {
                "connect": {"id": "your_author_id"}  # Remplacez par un ID utilisateur existant
            },
            "location": {
                "connect": {"id": location.id}
            },
            "personsInvolved": {
                "create": {
                    "historicalPerson": {
                        "connect": {"id": historical_person.id}
                    }
                }
            }
        }
        */