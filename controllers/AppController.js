import express from 'express';
import redisClient from '../utils/redis';

app = express();

app.get('/status', (req, res) => {
  if (redisClient.isAlive()) {
    res.status(200).json({ redis: true, db: true });
  }
})
app.get('/stats', (req, res) => {
  res.status(200).json({"": 200})
})