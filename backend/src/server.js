import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import matchRouter from './routes/matchRouter.js';
import playerRouter from './routes/playerRouter.js';
import pointsRouter from './routes/pointsRouter.js';
import teamRouter from './routes/teamRouter.js';
import tournamentRouter from './routes/tournamentRouter.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.use('/', authRouter);
app.use('/', dashboardRouter);
app.use('/matches', matchRouter);
app.use('/', playerRouter);
app.use('/', pointsRouter);
app.use('/', teamRouter);
app.use('/', tournamentRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));