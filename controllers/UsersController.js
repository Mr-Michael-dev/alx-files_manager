import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) {
        res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        res.status(400).json({ error: 'Missing password' });
      }

      const existingUser = await dbClient.users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exists' });
      }
      // hash the password
      const hashedPassword = sha1(password);

      // insert new user
      const result = await dbClient.users.insertOne({ email, password: hashedPassword });
      res.status(201).json({ id: result.insertedId, email });
    } catch (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const logUser = await redisClient.get(`auth_${token}`);
    // jsonify the data of logUser to be able to access the object
    const userData = JSON.parse(logUser);
    if (!logUser || logUser === undefined) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.status(200).json({ id: userData._id, email: userData.email });
    }
  }
}

export default UsersController;
