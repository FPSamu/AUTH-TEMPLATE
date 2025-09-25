import { MongoClient, Db } from "mongodb";

let db: Db;

export async function connectDB() {
  try {
    const mongo_uri = process.env.MONGO_URI;
    const db_name = process.env.DB_NAME;

    if (!mongo_uri) throw new Error("MONGO_URI is not defined");
    if (!db_name) throw new Error("DB_NAME is not defined");

    const client = new MongoClient(mongo_uri);
    await client.connect();

    db = client.db(db_name);
    console.log(`✅ MongoDB connected to database: ${db_name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}
