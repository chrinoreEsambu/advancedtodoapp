const express = require("express");
const path = require("path");
const session = require("express-session");
const ratelimit = require("express-rate-limit");
const cors = require("cors");
const prisma = require("../config/prismaClient");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const isDev = process.env.NODE_ENV !== "production";

const allowOrigin = [
  "http://localhost:5173",
  "https://todoxc.netlify.app",
  "https://n95rp9vf-5173.euw.devtunnels.ms",
];

exports.allowOrigin = allowOrigin;

exports.usersession = session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isDev ? "lax" : "none",
    secure: isDev ? false : true,
  },
});

exports.middleware = express.json();
exports.staticfiles = express.static(path.join(__dirname, "../public"));

exports.limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "too much request",
});

exports.corsi = cors({
  origin: function (origin, callback) {
    // autorise outils non-navigateurs (curl/postman)
    if (!origin) return callback(null, true);
    // en dev autorise toutes les origines
    if (isDev) return callback(null, true);
    if (allowOrigin.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
});

exports.validate = async (req, res, next) => {
  const { nom, mail, password, role } = req.body;
  if (!nom || !mail || !password) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    return res.status(400).json({ message: "Format d'email invalide" });
  }
  if (role && role !== "admin" && role !== "users") {
    return res
      .status(400)
      .json({ message: "Rôle invalide. Choisissez 'admin' ou 'users'" });
  }
  next();
};

exports.schekrole = async (req, res, next) => {
  try {
    const role = req.session?.role;
    if (!role || role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: { message: error.message },
    });
  }
};
