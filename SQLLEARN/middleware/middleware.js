const express = require("express");
const path = require("path");
const session = require("express-session");
const ratelimit = require("express-rate-limit");
const cors = require("cors");
const prisma = require("../config/prismaClient");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const app = express();

// Middleware JSON
exports.middleware = app.use(express.json());

// Static files
exports.staticfiles = app.use(
  express.static(path.join(__dirname, "../public"))
);

// Rate limiter
exports.limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later.",
});

// CORS config
const allowOrigin = ["http://localhost:5173", "https://todoxc.netlify.app"];

exports.corsi = cors({
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);
    if (!origin || allowOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});

// Session avec PrismaSessionStore
exports.usersession = session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // check every 2 minutes
    dbRecordIdIsSessionId: true,
  }),
});

// Validation corps requête
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

// Middleware vérification rôle admin
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
