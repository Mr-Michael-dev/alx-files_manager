import dbClient from "../utils/db";
import { v4 as uuid4 } from "uuid";
import redisClient from "../utils/redis";
const fs = require('fs');

class FilesController {
  static async postUpload(req, res) {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
      }
      // checks if the user is stored in the redis cache
      const redisToken = await redisClient.get(`auth_${token}`);
      if (!redisToken) {
        res.status(401).json({ error: 'Unauthorized' });
      }
      // destructure the request body to get individual value
      const {
        name, type,
        data, parentId = 0,
        isPublic = false,

      } = req.body;
      if (!name) res.status(400).json({ error: 'Missing name' });
      if (!type) res.status(400).json({ error: 'Missing type' });
      if (!data && type !== 'folder') res.status(400).json({ error: 'Missing data' });
      if (parentId) {
        const foundId = await dbClient.files.findOne(parentId);
        if (!foundId) res.status(400).json({ error: 'Parent not found' });
        else if (foundId.type !== 'folder') res.status(400).json({ error: 'Parent is not folder' });
        await dbClient.files.updateOne(parentId, { $set: { userId: redisToken._id } });
      }
      if (type === 'folder') {
        await dbClient.files.set({
          name, type, parentId, isPublic, data,
        });
      } else {
        const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
        // fs
        console.log();
      }
    } catch (error) {
      res.status(400);
    }
  }
}
export default FilesController;
