import redisClient from '../utils/redis';
import dbClient from '../utils/db';

// Used an object to create a static object for storing the route object
// instead of using express
// and then making an async call to the function to make it exportable
class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.status(200).json({ redis: true, db: true });
    }
  }

  static async getStats(req, res) {
    res.status(200).json({ users: await dbClient.nbUsers(), files: await dbClient.nbFiles() });
  }
}

export default AppController;
