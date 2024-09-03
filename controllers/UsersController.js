import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (email === undefined) {
      res.status(400).json({ error: 'Missing email' });
    } else if (password === undefined) {
      res.status(400).json({ error: 'Missing password' });
    } else if (dbClient.users.find({ email })) {
      res.status(400).json({ error: 'Already exist' });
    } else {
      const hashedPassword = sha1(password);
      // Get the insertedId value to be used
      const id = await dbClient.users.insertOne({ email, password: hashedPassword });
      res.status(201).json({ id: id.insertedId, email });
    }
  }
}

export default UsersController;
