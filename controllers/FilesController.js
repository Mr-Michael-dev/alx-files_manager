import * as fs from 'fs';
import { v4 as uuid4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(req, res) {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // checks if the user is stored in the redis cache
      const redisToken = await redisClient.get(`auth_${token}`);
      if (!redisToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // destructure the request body to get individual value
      const {
        name, type,
        data, parentId = 0,
        isPublic = false,

      } = req.body;
      if (!name) res.status(400).json({ error: 'Missing name' });
      if (!type) res.status(400).json({ error: 'Missing type' });
      if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
      const foundId = await dbClient.files.findOne({ id: parentId });
      if (parentId) {
        if (!foundId) res.status(400).json({ error: 'Parent not found' });
        if (foundId.type !== 'folder') return res.status(400).json({ error: 'Parent is not folder' });
        await dbClient.files.updateOne(parentId, { $set: { userId: redisToken._id } });
      }
      if (type === 'folder') {
        await dbClient.files.insertOne({
          userId: foundId._id,
          name,
          type,
          parentId,
          isPublic,
          data,
        });
        return res.status(201);
      }
      // for file and image file saving
      const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(FOLDER_PATH)) fs.mkdirSync(FOLDER_PATH, { recursive: true });
      const fileUUID = uuid4();
      const localPath = `${FOLDER_PATH}/${fileUUID}`;
      const fileData = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, fileData);

      const newFile = {
        userId: foundId._id,
        name,
        type,
        isPublic,
        parentId,
        localPath,
      };
      const fileResult = await dbClient.files.insertOne(newFile);
      return res.status(201).json(fileResult.ops[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
export default FilesController;
