const router = require("express-router");
const argons = require("argon2");
const prisma = require("../config/prismaClient");
const { adminCreateUser } = require("../controllers/adminController");
const { validate } = require("../middleware/middleware");

router.post("/api/dminCreateUser", validate, adminCreateUser);
