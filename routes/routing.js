const express = require('express');
const router = express.Router();
const MatchDetail = require('../dataBase/mongoDb');
const matchdetail = new MatchDetail();

/**
 * Retrieve all matches.
 * Route: GET /matchHub
 * This route retrieves all the matches from the database.
 */ 
router.get('/', async (req, res) => {
  try {
    const response = await matchdetail.getAllMatches();
    res.json(response);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});


/**
 * Retrieve match by id.
 * Route: GET /matchHub/id
 * Query Parameters:
 *   - `id`: id of the match.
 * This route retrieves match based on the specified id.
 */
router.get('/id', async (req, res) => {
  try {
    const { id } = req.query;
    const response = await matchdetail.getMatchById(id);
    res.json(response);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

/**
 * Retrieve matches by date.
 * Route: GET /matchHub/date
 * Query Parameters:
 *   - `date`: Date of the match
 * This route retrieves match based on the specified date.
 */
router.get('/date', async (req, res) => {
  const { date } = req.query;
  try {
    const response = await matchdetail.getMatchesByDate(date);
    res.json(response);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

/**
 * Get the performance for a given team.
 * Route: GET /matchHub/count
 * Query Parameters:
 *   - `team`: Team name whose performance need to be checked.
 * This route returns the count of number of wins and loss matches for a specific team.
 */
router.get('/count', async (req, res) => {
  const { team } = req.query;
  try {
    const winnerCount = await matchdetail.getCount({ winner: team });
    const loserCount = await matchdetail.getCount({ loser: team });
    res.json({ winnerCount, loserCount });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

/**
 * Create a new match.
 * Route: POST /matchHub
 * Request body:
 * {
 *   teamsInvolved: string,
 *   teamsComposition: string,
 *   date: string,
 *   venue: string
 * }
 * This route creates a new match with the provided data.
 */
router.post('/', async (req, res) => {
  const { teamsInvolved, teamsComposition, date, venue } = req.body;
  const MatchData = { teamsInvolved, teamsComposition, date, venue };
  try {
    const response = await matchdetail.createMatch(MatchData);
    res.json(response);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

/**
 * Update an existing match.
 * Route: PATCH /matchHub
 * Request body:
 * {
 *   teamsInvolved: string,
 *   date: string,
 *   playerOfMatch: string,
 *   winner: string,
 *   loser: string
 * }
 * This route updates an existing match with the provided data.
 */
router.patch('/', async (req, res) => {
  const { teamsInvolved, date } = req.body;
  const updateData = {
    playerOfMatch: req.body.playerOfMatch,
    winner: req.body.winner,
    loser: req.body.loser,
  };
  try {
    const updatedMatch = await matchdetail.updateMatchDetails(teamsInvolved, date, updateData);
    res.json(updatedMatch);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

module.exports = router;