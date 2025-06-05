const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2/promise");
require("dotenv").config();

const port = process.env.DBPORT || 3306;
const database = process.env.DBNAME;
const host = process.env.HOST;
const password = process.env.PASSWORD;
const user = process.env.USER;

const connexion = async () => {
  try {
    const connect = await mysql.createConnection({
      port,
      database,
      host,
      password,
      user,
    });
    console.log("Connected to db", database);
    return connexion;
  } catch (error) {
    console.log("erreor db connection", error.message);
  }
};
module.exports = { connexion };
