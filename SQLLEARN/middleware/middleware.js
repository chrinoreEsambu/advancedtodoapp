const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const os = require("os");
const ip = require("ip");
const mysql = require("mysql2");
const ratelimit = require("express-rate-limit");

const middleware = app.use(express.json());

const staticfiles = app.use(express.static(path.join(__dirname, "../public")));

const limiter = ratelimit({
  window: 15 * 60 * 1000,
  max: 10,
  message: "trop de requette",
});


module.exports = { middleware, staticfiles, limiter };
