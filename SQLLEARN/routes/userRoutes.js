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
  schekrole,
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
  adminconnexion,
  adminCreateUser,
  admincreatTask,
  getusertasksfront,
  userTasksCount,
  logOutAdmin,
  adminUpdateTaskState,
  addComments,
  getAdminLogs,
  updateTasksState,
} = require("../controllers/user.controllers");

const { addtask } = require("../controllers/addTask.controllers");

router.post("/api/usercreat", validate, createUser);
router.get("/api/getuserbyid/:user_id", getUserByid, getusertasks);
router.put("/api/userupdate/:user_id", userUpdate);
router.delete("/api/userdelete/:user_id", userDelete);
router.post("/api/connexion", usersession, connexion, getusertasks);
router.post("/api/logOut", usersession, logOut);
router.post("/api/addtask", usersession, addtask);
router.get("/api/getusertasks", usersession, getusertasks);

router.post("/api/admincreateuser", validate, adminCreateUser);
router.post("/api/adminconnexion", usersession, adminconnexion);
router.get("/api/admingetuser", usersession, getUser);
router.post("/api/admincreattask", usersession, admincreatTask);
router.put("/api/adminUpdateTaskState/:taskId", adminUpdateTaskState);
router.get("/api/getusertasksfront", getusertasksfront);

router.get("/api/adminTaskCount", userTasksCount);
router.post("/api/logOutAdmin", logOutAdmin);
// router.put("/api/addComments/:task_id", addComments);
router.get("/api/logs", getAdminLogs);

router.put("/api/updateTasksState/:task_id", updateTasksState);

module.exports = router;
