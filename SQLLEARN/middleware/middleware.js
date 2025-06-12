const express = require("express");
const path = require("path");
const app = express();
const os = require("os");
const ip = require("ip");
const session = require("express-session");
const ratelimit = require("express-rate-limit");
const argon2 = require("argon2");
const cors = require("cors");
const prisma = require("../config/prismaClient");
const { createUser } = require("../controllers/user.controllers");

exports.middleware = app.use(express.json());
exports.staticfiles = app.use(
  express.static(path.join(__dirname, "../public"))
);

exports.limiter = ratelimit({
  window: 15 * 60 * 1000,
  max: 10,
  message: "too musch request",
});

exports.usersession = session({
  secret: "votre_clef_secrete_supersecrete",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 1,
  },
});

exports.validate = async (req, res, next) => {
  const { nom, mail, password } = req.body;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    return res.status(400).json({ message: "Format d'email invalide" });
  }
  try {
    if (!nom || !mail || !password) {
      return res.status(400).json({ message: "Empty Fields" });
    } else {
      await createUser(req, res);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server is down", error: { message: error.message } });
  }
  next();
};

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// <- Pas de double parenthèse `}););`
