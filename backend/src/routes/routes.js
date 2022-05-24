import express from 'express';
import teamsInfos from '../controllers/team.js';
import stats from '../controllers/statistics.js'
const router = express.Router();
router.get('/teamInfo', teamsInfos);
router.get('/statistics', stats);
export default router;