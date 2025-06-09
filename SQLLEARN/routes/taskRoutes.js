const express = require("express");
const app = express();
const path = require("path");
const prisma = require("../config/prismaClient");
const router = express.Router();
const { limiter } = require("../middleware/middleware");

const { addtask } = require("../controllers/addTask.controllers");

router.post("/api/addtask", addtask);

module.exports = router;
