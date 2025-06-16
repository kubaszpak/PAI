import express from 'express';
import { submitVote } from '../controllers/voteController';

const router = express.Router();

router.post('/vote', submitVote);

export default router;