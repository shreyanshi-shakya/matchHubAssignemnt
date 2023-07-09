const mongoose = require('mongoose');

// Define the match schema using mongoose.Schema
const matchSchema = new mongoose.Schema(
  {
    winner: {
      type: String,
      required: false,
      default: null,
    },
    loser: {
      type: String,
      required: false,
      default: null,
    },
    teamsInvolved: {
      type: String,
      required: true,
    },
    teamsComposition: {
      type: String,
      required: true,
    },
    playerOfMatch: {
      type: String,
      required: false,
      default: 'unknown'
    },
    date: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

// Create the matchModel  using the matchSchema 
const matchModel = mongoose.model('matches', matchSchema);

// MatchHub class encapsulating the business logic for match operations
class MatchHub {
  /**
   * Retrieve all matches.
   * @returns {Promise<Array>} Array of all matches.
   */
  async getAllMatches() {
    try {
      const response = await matchModel.find();
      return response;
    } catch (err) {
      throw new Error('Error fetching matches: ' + err);
    }
  }

  /**
   * Retrieve a specific match by its ID.
   * @param {string} id - ID of the match to retrieve.
   * @returns {Promise<Object>} match object.
   */
  async getMatchById(id) {
    try {
      const response = await matchModel.findById(id).select('teamsInvolved teamsComposition  venue playerOfMatch');
      if (response) {
        return response;
      } else {
        throw new Error('Match not found');
      }
    } catch (err) {
      throw new Error('Error fetching match: ' + err);
    }
  }

  /**
   * Retrieve matches by date.
   * @param {string} date - Date of the match.
   * @returns {Promise<Array>} Array of matches for the specified date.
   */
  async getMatchesByDate(date) {
    try {
      const response = await matchModel.find({ date }).select('teamsInvolved date');
      return response;
    } catch (err) {
      throw new Error('Error fetching match by date: ' + err);
    }
  }

    /**
   * Count matches based on the given query.
   * @param {Object} query - Query to filter matches.
   * @returns {Promise<number>} Count of matches.
   */
    async getCount(query) {
      try {
        const count = await matchModel.countDocuments(query);
        return count;
      } catch (err) {
        throw new Error('Error counting matches: ' + err);
      }
    }

  /**
   * Create a new match.
   * @param {Object} matchData - Data for the new match.
   * @returns {Promise<Object>} Newly created match object.
   */
  async createMatch(matchData) {
    const model = new matchModel(matchData);
    try {
      const response = await model.save();
      return response;
    } catch (err) {
      throw new Error('Error creating match: ' + err);
    }
  }

  /**
   * Update an existing match.
   * @param {string} teamsInvolved - Teams involved in the match match.
   * @param {string} date - Date of the match match.
   * @param {Object} updateData - Data to update for the match.
   * @returns {Promise<Object>} Updated match object.
   */
  async updateMatchDetails(teamsInvolved, date, updateData) {
    try {
      const response = await matchModel.findOneAndUpdate(
        { teamsInvolved, date },
        { $set: updateData },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error('Error updating match: ' + err);
    }
  }
}

module.exports = MatchHub;