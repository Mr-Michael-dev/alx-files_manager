// Import the MongoClient class from the MongoDB package
import { MongoClient } from 'mongodb';

class DBClient {
  // Constructor to initialize and connect to the MongoDB database
  constructor() {
    // Set the MongoDB connection parameters from environment variables, with defaults if not set
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

    // Construct the MongoDB URI
    const uri = `mongodb://${DB_HOST}:${DB_PORT}`;

    // Create a new MongoClient instance
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to the MongoDB server
    this.client.connect()
      .then(() => {
        console.log('Connected successfully to MongoDB');
        this.db = this.client.db(DB_DATABASE);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      })
      .catch((err) => console.error('Connection to MongoDB failed:', err));
  }

  // Method to check if the MongoDB client is alive (connected)
  isAlive() {
    return this.client.topology.isConnected();
  }

  // return the number of documents in the collection users
  async nbUsers() {
    const nbUsers = await this.users.countDocuments({});
    return nbUsers;
  }

  // return the number of documents in the collection files
  async nbFiles() {
    const nbFiles = await this.files.countDocuments({});
    return nbFiles;
  }
}

const dbClient = new DBClient();
export default dbClient;
