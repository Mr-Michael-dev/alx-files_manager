import express from 'express';
import AppController from './controllers/AppController';
const router = express.Router()

router.get('/status', (req, res) => {
  return AppController.getStatus;
});
router.get('/stats', (req, res) => {
  return AppController.getStats;
});
