import { MongoClient } from "mongodb";

class DatabaseService {
  private client: MongoClient;
  private uri: string;

  constructor() {
    this.uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    this.client = new MongoClient(this.uri);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Successfully connected to MongoDB.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log("Successfully disconnected from MongoDB.");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }

  getDb(dbName: string = "music-tails") {
    return this.client.db(dbName);
  }
}

export const db = new DatabaseService();
