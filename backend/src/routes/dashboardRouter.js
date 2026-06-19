import { Router }  from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getDashboard } from '../controllers/dashboardController.js';

const dashboardRouter = Router();

dashboardRouter.get('/player/dashboard', verifyToken, getDashboard);

export default dashboardRouter;
