import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  // AuthController.getConnect
  static async getConnect(req, res) {
    // using the split method to parse a valid base64 string for atob
    const authHeader = req.headers.authorization.split('Basic ')[1];
    // The atob is for splitting the base64 encoding and then converting it to a string
    // eslint-disable-next-line no-undef
    const [email, password] = atob(authHeader).split(':');

    const user = await dbClient.users.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    if (user && sha1(password) === user.password) {
      const userUUID = uuidv4();
      const key = `auth_${userUUID}`;
      await redisClient.set(key, JSON.stringify(user), 24 * 60 * 60);
      res.status(200).json({ token: userUUID });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  static async getDisconnect(req, res) {
    // search for the x-token header to see if token is present & delete it
    const token = req.headers['x-token'];
    const foundToken = await redisClient.get(`auth_${token}`);

    if (!foundToken) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      redisClient.del(`auth_${token}`);
      res.status(201);
    }
  }
}

export default AuthController;
