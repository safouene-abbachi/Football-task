import axios from 'axios';
/**
 * It takes in a query parameter called team, and returns all the teams that match the query parameter
 * @param req - The request object.
 * @param res - The response object that will be sent back to the client.
 * @returns the response from the API call to the football-data.org API.
 */
const getTeamsDetails = async (req, res) => {
  try {
    const { team } = req.query;
    const teamResponse = await axios.get(
      `https://api.football-data.org/v4/competitions/PL/teams`
    );
    const allTeamsInfo = teamResponse.data.teams.filter((teamInfo) =>
      teamInfo.name.toLowerCase().includes(team?.toString().toLowerCase())
    );
    return res.status(200).json(allTeamsInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
export default getTeamsDetails;
