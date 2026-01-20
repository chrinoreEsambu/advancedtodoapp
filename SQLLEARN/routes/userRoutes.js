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

  admStateFinder,
  adminGetUserMessages,
  adminReplyToComment,
  getAllMessages,
  getCommentsByTask,
  replyToMessage,
} = require("../controllers/user.controllers");

const {
  addtask,
  deleteTask,
  adminDeleteTask,
  adminAddTaskComment,
} = require("../controllers/addTask.controllers");

router.post("/api/usercreat", createUser);
router.get("/api/getuserbyid/:user_id", getUserByid, getusertasks);
router.put("/api/userupdate/:user_id", userUpdate);
router.delete("/api/userdelete/:user_id", userDelete);
router.post("/api/connexion", usersession, connexion, getusertasks);
router.post("/api/logOut", usersession, logOut);
router.post("/api/addtask", usersession, addtask);
router.delete("/api/deletetask/:taskId", usersession, deleteTask);
router.delete("/api/admin/deletetask/:taskId", usersession, adminDeleteTask);
router.get("/api/getusertasks", usersession, getusertasks);

router.post("/api/admincreateuser", adminCreateUser);
router.post("/api/adminconnexion", usersession, adminconnexion);
router.get("/api/admingetuser", usersession, getUser);
router.post("/api/admincreattask", usersession, admincreatTask);
router.put("/api/adminUpdateTaskState/:taskId", adminUpdateTaskState);
router.get("/api/getusertasksfront", getusertasksfront);

router.get("/api/adminTaskCount", userTasksCount);
router.post("/api/logOutAdmin", logOutAdmin);
router.post("/api/addComments/:task_id", addComments);
router.get("/api/logs", getAdminLogs);
router.post("/api/adminAddTaskComment", adminAddTaskComment);

router.put("/api/updateTasksState/:task_id", updateTasksState);
router.get("/api/admStateFinder", admStateFinder);

router.get("/api/getMyMessages", getAllMessages);
router.post("/api/sendMessage", replyToMessage);

router.get("/api/getCommentsByTask/:task_id", getCommentsByTask);

module.exports = router;
