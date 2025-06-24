const router = require("express-router");
const argons = require("argon2");
const prisma = require("../config/prismaClient");
const { adminCreateUser } = require("../controllers/adminController");

router.post("/api/dminCreateUser", adminCreateUser);
