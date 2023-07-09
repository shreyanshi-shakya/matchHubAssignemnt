const request = require('supertest');
const express = require('express');
const router = require('./routing');

const MatchHub = require('../dataBase/mongoDb');
jest.mock('../dataBase/mongoDb');

describe('Match Router', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/matchHub', router);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /matchHub', () => {
    it('should return all matches', async () => {
      const match = [{ _id: '12345', teamsComposition: '3 Batsman , 3 bowlers , 5 AllRounders', date: '2023-07-07', venue: 'Stadium X Delhi' }];
      MatchHub.prototype.getAllMatches.mockResolvedValue(match);
  
      const response = await request(app).get('/matchHub');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(match);
      expect(MatchHub.prototype.getAllMatches).toHaveBeenCalled();
    });
  
    it('should handle errors when fetching matches', async () => {
      const errorMessage = 'Error fetching matches';
      MatchHub.prototype.getAllMatches.mockRejectedValue(new Error(errorMessage));
  
      const response = await request(app).get('/matchHub');
  
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error: ' + errorMessage);
      expect(MatchHub.prototype.getAllMatches).toHaveBeenCalled();
    });
  });

  describe('GET /matchHub/id', () => {
    it('should return the match with the specified ID', async () => {
      const matchId = '12345';
      const match = {
        _id: matchId,
        teamsInvolved: 'Team A vs Team B',
        teamsComposition: '3 batsman, 4 baller & 4 AllRounder',
        date: '10-08-2022',
        venue: 'Stadium X Delhi'
      };
      MatchHub.prototype.getMatchById.mockResolvedValue(match);
  
      const response = await request(app).get(`/matchHub/id?id=${matchId}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(match);
      expect(MatchHub.prototype.getMatchById).toHaveBeenCalledWith(matchId);
    });
  
    it('should handle errors when fetching the match by ID', async () => {
      const matchId = '12345';
      const errorMessage = 'Error fetching match';
      MatchHub.prototype.getMatchById.mockRejectedValue(new Error(errorMessage));
  
      const response = await request(app).get(`/matchHub/id?id=${matchId}`);
  
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error: ' + errorMessage);
      expect(MatchHub.prototype.getMatchById).toHaveBeenCalledWith(matchId);
    });
  });
  
  
  describe('GET /matchHub/date', () => {
    it('should return match by date if a valid date query parameter is provided', async () => {
      const date = '2023-07-07';
      const match = [{ teamsInvolved: 'Team A vs Team B', date: '2023-07-07' }];
      MatchHub.prototype.getMatchesByDate.mockResolvedValue(match);
  
      const response = await request(app).get('/matchHub/date').query({ date });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(match);
      expect(MatchHub.prototype.getMatchesByDate).toHaveBeenCalledWith(date);
    });
  
    it('should handle errors when fetching match by date', async () => {
      const date = '2023-07-07';
      const errorMessage = 'Error fetching match by date';
      MatchHub.prototype.getMatchesByDate.mockRejectedValue(new Error(errorMessage));
  
      const response = await request(app).get('/matchHub/date').query({ date });
  
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error: ' + errorMessage);
      expect(MatchHub.prototype.getMatchesByDate).toHaveBeenCalledWith(date);
    });
  });
  
  describe('GET /mathHub/count', () => {
    it('should return the count of matches for the given team', async () => {
      const team = 'Team A';
      const winnerCount = 5;
      const loserCount = 3;
      
      MatchHub.prototype.getCount.mockResolvedValueOnce(winnerCount);
      MatchHub.prototype.getCount.mockResolvedValueOnce(loserCount);

      const response = await request(app).get('/matchHub/count').query({ team });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ winnerCount, loserCount });
      expect(MatchHub.prototype.getCount).toHaveBeenCalledWith({ winner: team });
      expect(MatchHub.prototype.getCount).toHaveBeenCalledWith({ loser: team });
    });

    it('should handle errors thrown by MatchHub when counting match', async () => {
      const team = 'Team A';
      const errorMessage = 'Error counting match';
      MatchHub.prototype.getCount.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/matchHub/count').query({ team });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error: ' + errorMessage);
      expect(MatchHub.prototype.getCount).toHaveBeenCalledWith({ winner: team });
    });
  });

  describe('POST /matchHub', () => {
    it('should create a new match', async () => {
      const matchData = {
        teamsInvolved: 'Team A vs Team B',
        teamsComposition: '3 batsman,4 baller & 4 AllRounder',
        date: '2023-07-07',
        venue: 'Stadium X',
      };
      const match = { _id: '12345', ...matchData };
      
      MatchHub.prototype.createMatch.mockResolvedValue(match);

      const response = await request(app).post('/matchHub').send(matchData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(match);
      expect(MatchHub.prototype.createMatch).toHaveBeenCalledWith(matchData);
    });

    it('should handle errors thrown by MatchHub when creating an match', async () => {
      const matchData = {
        teamsInvolved: 'Team A vs Team B',
        teamsComposition: '3 batsman,4 baller & 4 AllRounder',
        date: '2023-07-07',
        venue: 'Stadium X',
      };
      const errorMessage = 'Error creating match';
      MatchHub.prototype.createMatch.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).post('/matchHub').send(matchData);

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error: ' + errorMessage);
      expect(MatchHub.prototype.createMatch).toHaveBeenCalledWith(matchData);
    });
  });

  describe('PATCH  /matchHub', () => {
    it('should update an existing match', async () => {
      const teamsInvolved = 'Team A vs Team B';
      const date = '2023-07-07';
      const updateData = {
        playerOfMatch: 'Player1',
        winner: 'Team A',
        loser: 'Team B',
      };
      const updateMatch = { _id: '12345', teamsInvolved, date, ...updateData };
      
      MatchHub.prototype.updateMatchDetails.mockResolvedValue(updateMatch);

      const response = await request(app).patch('/matchHub').send({ teamsInvolved, date, ...updateData });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updateMatch);
      expect(MatchHub.prototype.updateMatchDetails).toHaveBeenCalledWith(teamsInvolved, date, updateData);
    });

    it('should handle errors thrown by MatchHub when updating an match', async () => {
      const teamsInvolved = 'Team A vs Team B';
      const date = '2023-07-07';
      const updateData = {
        playerOfMatch: 'Player1',
        winner: 'Team A',
        loser: 'Team B',
      };
      const errorMessage = 'Error updating match';
      MatchHub.prototype.updateMatchDetails.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).patch('/matchHub').send({ teamsInvolved, date, ...updateData });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error: ' + errorMessage);
      expect(MatchHub.prototype.updateMatchDetails).toHaveBeenCalledWith(teamsInvolved, date, updateData);
    });
  });
});