

# MatchHub

MatchHub is a platform which helps us to store and manage records of matches played between different teams. It  stores the information about matches, teams and other related data. MatchHub offers various features to fetch and analyze match data, including searching matches by date, analyzing the performance of the team by giving number of wins and loss matches, creating new matches, and updating existing match details.

## Features

Fetch all matches: Get a list of all matches stored in the database.

Fetch detail of match by id: Get a detail of particular match.

Fetch matches by date: Filter and fetch matches based on a specific date.

Check the performance of the team: Get the count of won and lost matches of a given team.

Create a new match: Add a new match record to the database.

Update an existing match: Modify details of an existing match.


## Technologies Used

Node.js: A JavaScript runtime environment.

Express.js: A web application framework for Node.js.

MongoDB: A NoSQL database for storing match data.

Mongoose: An Object Data Modeling (ODM) library for MongoDB.

Jest: A JavaScript testing framework for unit testing.
## Installation

Clone the repository: git clone https://github.com/shreyanshi-shakya/matchHubAssignemnt.git

Navigate to the project directory: cd matchHubAssignment

Install dependencies: npm install

Set up the MongoDB database and provide the database URL.

Install the nodemon as dev dependency: npm install -g nodemon --save-dev   

Start the server: nodemon app.js   

If you don't want to install nodemon then start the server using : node app.js
## API Reference

GET /matchHub: Retrieve all matches.

GET /matchHub/date?date=DD-MM-YYYY: Retrieve matches for a specific date.

GET /matchHub/id?id=Id: Retrieve matches for a specific date.

GET /matchHub/count?team=team-name: Get the count of matches for a specific team.

POST /matchHUb: Create a new match.

Request body:
{
  "teamsInvolved": "Team A vs Team B",
  "teamsComposition":"3 batsman,4 baller & 4 AllRounder",
  "date": "2023-07-03",
  "venue": "Stadium X Delhi"
}


PATCH /matchHub: Update an existing match.

Request body:
{
  "teamsInvolved": "Team A vs Team B",
  "date": "2023-07-01",
  "playerOfMatch": "Player1",
  "winner": "Team A",
  "loser": "Team B"
}

## Unit Testing

On the termial Run: npx jest