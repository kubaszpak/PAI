import express from 'express';
import { createEvent, getEventById } from '../controllers/eventController';

const router = express.Router();

router.post('/events', createEvent);
router.get('/events/:id', getEventById);

export default router;