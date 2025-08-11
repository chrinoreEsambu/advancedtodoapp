const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const ratelimit = require("express-rate-limit");
const argon2 = require("argon2");
const cors = require("cors");
const prisma = require("../config/prismaClient");

const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

const { createUser } = require("../controllers/user.controllers");

// pour les session express session
// exports.usersession = session({
//   secret: "votre_clef_secrete_supersecrete",
//   resave: false,
//   sameSite: "lax",
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//     // maxAge: 1000 * 60 * 60,
//   },
// });
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.connect().catch(console.error);

exports.usersession = session({
  store: new RedisStore({ client: redisClient }),
  secret: "votre_clef_secrete_supersecrete",
  resave: false,
  sameSite: "lax",
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

exports.middleware = app.use(express.json());
exports.staticfiles = app.use(
  express.static(path.join(__dirname, "../public"))
);

exports.limiter = ratelimit({
  window: 15 * 60 * 1000,
  max: 10,
  message: "too musch request",
});

const allowOrigin = [
  "https://n95rp9vf-5173.euw.devtunnels.ms",
  "http://localhost:5173",
  "https://todoxc.netlify.app",
];
// nouvelle versioon prod
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
