import sha1 from 'sha1';
import uuid4 from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  // AuthController.getConnect
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    // The atob is for splitting the base64 encoding and then converting it to a string
    // eslint-disable-next-line no-undef
    const [email, password] = atob(authHeader).split(':');

    const user = await dbClient.users.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    } else if (user && sha1(password) === user.password) {
      const userUUID = uuid4();
      const key = `auth_${userUUID}`;
      await redisClient.set(key, user, 24 * 60 * 60);
      res(200).json({ token: '155342df-2399-41da-9e8c-458b6ac52a0c' });
    }
  }

  static async getDisconnect(req, res) {
    // search for the x-token header to see if token is present & delete it
    const token = req.headers['X-Token'];
    if (token === undefined) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      await redisClient.del(token);
      res.status(201);
    }
  }
}

export default AuthController;
