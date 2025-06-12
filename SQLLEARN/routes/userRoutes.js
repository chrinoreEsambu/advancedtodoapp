const express = require("express");
const app = express();
const path = require("path");
const argon2 = require("argon2");
const prisma = require("../config/prismaClient");
const router = express.Router();
const {
  limiter,
  validate,
  usersession,
  book,
} = require("../middleware/middleware");
const {
  createUser,
  getUser,
  getUserByid,
  userUpdate,
  userDelete,
  connexion,
  logOut,
  getusertasks,
} = require("../controllers/user.controllers");

const { addtask } = require("../controllers/addTask.controllers");

router.post("/api/usercreat", validate, createUser);
router.get("/api/getuser", getUser);
router.get("/api/getuserbyid/:user_id", getUserByid);
router.put("/api/userupdate/:user_id", userUpdate);
router.delete("/api/userdelete/:user_id", userDelete);
router.post("/api/connexion", usersession, connexion, getusertasks);
router.post("/api/logOut", usersession, logOut);
router.post("/api/addtask", usersession, addtask);
router.get("/api/getusertasks", usersession, getusertasks);
module.exports = router;
