import { Router } from 'express';
import { generateFixtures, getByTournament, enterResult, getHistory, getPlayerHistory } from '../controllers/matchController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/history',                   getHistory);
router.get('/player-history',            verifyToken, getPlayerHistory);
router.get('/tournament/:tournamentId',  getByTournament);
router.post('/generate/:tournamentId',   verifyToken, isAdmin, generateFixtures);
router.put('/:matchId/result',           verifyToken, isAdmin, enterResult);

export default router;
