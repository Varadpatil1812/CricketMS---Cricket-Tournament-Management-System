import { Router }  from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { getTeams, getTeamPlayers, addTeam } from '../controllers/teamController.js';

const teamRouter = Router();

teamRouter.get('/teams', getTeams);
teamRouter.get('/teams/:id/players', getTeamPlayers);
teamRouter.post('/teams', verifyToken, isAdmin, addTeam);

export default teamRouter;
