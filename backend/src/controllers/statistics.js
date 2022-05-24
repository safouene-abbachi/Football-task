import axios from 'axios';

/**
 * It fetches the matches of a team from the football-data API and returns the statistics of the team
 * @param req - The request object.
 * @param res - The response object.
 * @returns The statistics of the team.
 */
export const getStats = async (req, res) => {
  const { team: id } = req.query;
  try {
    const matchesResponse = await axios.get(
      `https://api.football-data.org/v4/teams/${id}/matches`
    );
    const matches = matchesResponse.data.matches.filter(
      (match) => match.competition.id == 2021
    );
    console.log('🚀 ~ matches', matches);

    const matchesStat = matches.reduce(
      (a, b) => {
        const teamStat =
          b['homeTeam']['id'].toString() === id
            ? { team: 'home', otherTeam: 'away' }
            : { team: 'away', otherTeam: 'home' };
        const score = b['score']['fullTime'];
        a['goals'] += score[teamStat.team];
        score[teamStat.team] > score[teamStat.otherTeam]
          ? a['win'][teamStat.team]++
          : score[teamStat.team] < score[teamStat.otherTeam]
          ? a['lost'][teamStat.team]++
          : null;
        return { ...a, averageGoals: Math.round(a.goals / matches.length) };
      },
      {
        goals: 0,
        win: { home: 0, away: 0 },
        lost: { home: 0, away: 0 },
      }
    );
    return res.status(200).json(matchesStat);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.send(error.message);
    }
  }
};
export default getStats;
