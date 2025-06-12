const express = require("express");
const app = express();
const path = require("path");
const prisma = require("../config/prismaClient");
const router = express.Router();
const { limiter } = require("../middleware/middleware");

const { addtask, addtask8 } = require("../controllers/addTask.controllers");

router.post("/api/addtask", addtask);

router.post("/api/88", async (req, res) => {
  const { task } = req.body;
  const user_id = req.session.user_id;
  await addtask8(task, user_id);
});

module.exports = router;
