import { Router }  from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { getTournaments, getTournamentTeams,createTournament,addTeams } from '../controllers/tournamentController.js';

const tournamentRouter = Router();

tournamentRouter.get('/tournaments', getTournaments);
tournamentRouter.get('/tournaments/:id/teams', getTournamentTeams);
tournamentRouter.post('/tournaments', verifyToken, isAdmin, createTournament);
tournamentRouter.post('/tournaments/:id/add-teams', verifyToken, isAdmin, addTeams);

export default tournamentRouter;
