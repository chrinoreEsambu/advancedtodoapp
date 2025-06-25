const express = require("express");
const app = express();
const path = require("path");
const argon2 = require("argon2");
const prisma = require("../config/prismaClient");
const router = express.Router();
const {
  adminCreateUser,
  adminConnexion,
} = require("../controllers/adminController");

router.post("/api/adminCreateUser", adminCreateUser);
router.post("/api/adminConnexion", adminConnexion);

module.exports = router;
