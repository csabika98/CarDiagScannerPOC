import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB URI from environment variables
let client;
let db;

if (!uri) {
  throw new Error('Please add your Mongo URI to the .env file');
}

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri); // Connect without deprecated options
    await client.connect();
    db = client.db(process.env.MONGODB_DB); // Use the database name from the .env file
  }
  return { db, client };
}



