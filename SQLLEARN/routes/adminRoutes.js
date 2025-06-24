const router = require("express-router");
const argons = require("argon2");
const prisma = require("../config/prismaClient");
const {
  adminCreateUser,
  adminConnexion,
} = require("../controllers/adminController");
const { validate } = require("../middleware/middleware");

router.post("/api/dminCreateUser", validate, adminCreateUser);
router.post("/api/adminConnexion", adminConnexion);

module.exports = router;
