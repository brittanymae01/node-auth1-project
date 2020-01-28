const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const dbConnection = require("../data/dbConfig");

const sessionConfig = {
  name: "cookie",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearINterval: 60000
  })
};

module.exports = server => {
  server.use(helmet());
  server.use(session(sessionConfig));
  server.use(express.json());
  server.use(cors());
};
