import { Router }  from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { getPointsTable } from '../controllers/pointsController.js';

const pointsRouter = Router();

pointsRouter.get('/points/:tournamentId', getPointsTable);

export default pointsRouter;
