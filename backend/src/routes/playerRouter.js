import { Router }  from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { getPlayers,searchPlayer,assignPlayer } from '../controllers/playerController.js';

const playerRouter = Router();

playerRouter.get('/players', verifyToken, isAdmin, getPlayers);
playerRouter.get('/players/search', verifyToken, isAdmin, searchPlayer);
playerRouter.put('/players/:id/assign', verifyToken, isAdmin, assignPlayer);

export default playerRouter;
