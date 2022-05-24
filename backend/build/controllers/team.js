"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const getTeamInfoByName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const competitionResponse = yield axios_1.default.get("https://api.football-data.org/v2/competitions");
        const { id } = competitionResponse.data.competitions.find((competition) => competition.name === req.params.competition);
        const seasonResponse = yield axios_1.default.get(`https://api.football-data.org/v2/competitions/${id}`);
        const { startDate, endDate } = seasonResponse.data.seasons.find((season) => season.startDate.startsWith(req.params.season));
        const teamResponse = yield axios_1.default.get(`https://api.football-data.org/v2/competitions/${id}/teams`);
        const teamInfo = teamResponse.data.teams.find((teamInfo) => teamInfo.name.toLowerCase().startsWith(req.params.team));
        const matchesResponse = yield axios_1.default.get(`https://api.football-data.org/v2/teams/${teamInfo.id}?dateFrom=${startDate}&dateTo=${endDate})`);
        const matches = matchesResponse.data.matches.filter((match) => match.competition.id == id);
        const matchesStat = matches.reduce((a, b) => {
            const venue = b["homeTeam"]["id"] === teamInfo.id
                ? { team: "homeTeam", otherTeam: "awayTeam" }
                : { team: "awayTeam", otherTeam: "homeTeam" };
            const score = b["score"]["fullTime"];
            a["goals"] += score[venue.team];
            score[venue.team] > score[venue.otherTeam]
                ? a["win"][venue.team]++
                : score[venue.team] < score[venue.otherTeam]
                    ? a["lost"][venue.team]++
                    : null;
            return a;
        }, { goals: 0, win: { homeTeam: 0, awayTeam: 0 }, lost: { homeTeam: 0, awayTeam: 0 } });
        return res.status(200).json({ teamInfo, matches, matchesStat });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.send(error.message);
        }
    }
    ;
});
exports.default = { getTeamInfoByName };
