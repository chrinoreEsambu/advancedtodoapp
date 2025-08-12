const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const ratelimit = require("express-rate-limit");
const cors = require("cors");
const prisma = require("../config/prismaClient");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const isProduction = process.env.NODE_ENV === "production";

// Configuration CORS
const allowOrigin = ["http://localhost:5173", "https://todoxc.netlify.app"];

exports.corsi = cors({
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);
    // Permettre les requêtes sans origin (ex: applications mobiles, Postman)
    if (!origin || allowOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Très important pour les sessions
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Configuration session
exports.usersession = session({
  name: "sessionId", // Nom personnalisé pour le cookie
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction, // HTTPS requis en production
    httpOnly: true, // Sécurité supplémentaire
  },
  secret: process.env.SESSION_SECRET || "your_fallback_secret_here",
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

// Autres middlewares
exports.middleware = express.json();
exports.staticfiles = express.static(path.join(__dirname, "../public"));

exports.limiter = ratelimit({
  windowMs: 15 * 60 * 1000, // Utilisez windowMs au lieu de window
  max: 10,
  message: "Trop de requêtes, essayez plus tard",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de validation
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

// Middleware de vérification du rôle avec debug amélioré
exports.schekrole = async (req, res, next) => {
  try {
    console.log("Session data:", req.session); // Debug
    console.log("Session ID:", req.sessionID); // Debug

    if (!req.session) {
      return res.status(401).json({
        message: "Session non trouvée",
        debug: "No session object",
      });
    }

    const role = req.session.role;

    if (!role) {
      return res.status(401).json({
        message: "Rôle non défini dans la session",
        debug: "No role in session",
      });
    }

    if (role.toLowerCase() !== "admin") {
      return res.status(403).json({
        message: "Accès réservé aux administrateurs",
        debug: `Role is: ${role}`,
      });
    }

    next();
  } catch (error) {
    console.error("Error in role check:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la vérification du rôle",
      error: { message: error.message },
    });
  }
};

// Middleware pour debug des sessions (à utiliser temporairement)
exports.debugSession = (req, res, next) => {
  console.log("=== SESSION DEBUG ===");
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  console.log("Cookies:", req.headers.cookie);
  console.log("Origin:", req.get("Origin"));
  console.log("User-Agent:", req.get("User-Agent"));
  console.log("====================");
  next();
};
