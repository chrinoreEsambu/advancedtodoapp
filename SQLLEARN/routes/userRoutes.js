const express = require("express");
const app = express();
const path = require("path");
const argon2 = require("argon2");
const prisma = require("../config/prismaClient");
const router = express.Router();
const { limiter } = require("../middleware/middleware");
const {
  createUser,
  getUser,
  getUserByid,
  userUpdate,
  userDelete,
} = require("../controllers/user.controllers");

router.post("/api/usercreat", createUser);
router.get("/api/getuser", getUser);
router.get("/api/getuserbyid/:user_id", getUserByid);
router.put("/api/userupdate/:user_id", userUpdate);
router.delete("/api/userdelete/:user_id", userDelete);

module.exports=router;