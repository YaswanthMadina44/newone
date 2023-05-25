const express = require("express");
const path = require("path");
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1

app.get("/players/", async (request, response) => {
  let data = `SELECT * from cricket_team;`;
  let result = await db.all(data);
  response.send(result);
});

//API 2
app.post("/players/", async (request, response) => {
  let { playerName, jerseyNumber, role } = request.body;
  let result = `insert into cricket_team(playerName, jerseyNumber, role) 
  values(${playerName}, ${jerseyNumber}, ${role});`;
  let final = await db.run(result);
  response.send("Player added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  let playerId = request.params;
  let data = `SELECT * from cricket_team where playerId=${playerId};`;
  let result = await db.get(data);
  response.send(result);
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  let playerId = request.params;
  let details = request.body;
  let { playerName, jerseyNumber, role } = details;
  let data = `update cricket_team set playerName=${playerName},
  jerseyNumber=${jerseyNumber}, role=${role} where playerId=${playerId};`;
  let result = await db.get(data);
  response.send("Player Details Updated");
});
