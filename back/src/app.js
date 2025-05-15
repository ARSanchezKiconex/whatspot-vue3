const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();
const server_port = process.env.PORT;

// SETTING
app.set("port", server_port); //Puerto donde va a correr el servidor backend.

// Configure Header HTTPS
const frontend_client = process.env.FRONTEND_CLIENT;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontend_client);
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//HTTP
app.use(cors()); //Servidor para intercambio de información

//el servidor utilizará tanto formato json com text-plain para intercambio información
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }));

// ROUTES
// rutas para interpretar las peticiones en la API
app.use("/rooms", require("./routes/rooms"));


module.exports = app;
