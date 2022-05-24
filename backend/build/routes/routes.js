"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const team_1 = __importDefault(require("../controllers/team"));
const router = express_1.default.Router();
router.get('/teamInfo/:competition/:season/:team', team_1.default.getTeamInfoByName);
module.exports = router;
