const express = require("express");
const app = express();
const path = require("path");
const argon2 = require("argon2");
const prisma = require("../config/prismaClient");
const { limiter } = require("../middleware/middleware");

const createuser = app.post("/api/usercreat", limiter, async (req, res) => {
try {
const { nom, mail, password } = req.body;

    const date = new Date().getFullYear();
    const suffix = Math.floor(100 + Math.random() * 900);
    const user_id = `${date}todox${suffix}`;

    const hachpass = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 * 12,
      timeCost: 2,
      hachLeght: 50,
      parallelism: 3,
    });
    const usercreation = await prisma.user.create({
      data: {
        user_id,
        nom,
        mail,
        password: hachpass,
      },
    });
    res.status(201).json({ message: "user creat successfully", usercreation });

} catch (error) {
res.status(500).json({
Message: "error during user creation",
error: { message: error.message },
});
}
});

const getuser = app.get("/api/getuser", limiter, async (req, res) => {
try {
const findalluser = await prisma.user.findMany({
// skip:1,
// take:2
});
if (findalluser.length > 0) {
res.status(201).json({ message: "All user", findalluser });
} else {
res.status(201).json({ message: "nothing find", findalluser });
}
} catch (error) {
if (findalluser > 0) {
}
res.status(500).json({
Message: "error durring getuser request",
error: { message: error.message },
});
}
});

const getuser_byid = app.get("/api/getuserbyid/:user_id", async (req, res) => {
try {
const { user_id } = req.params;
const findbyid = await prisma.user.findUnique({
where: {
user_id,
},
});
if (!findbyid) {
res.status(204).json({ message: "okey", findbyid });
} else {
res.status(200).json({ message: "okey", findbyid });
}
res.status(200).json({ message: "okey" });
} catch (error) {
res.status(500).json({
message: "something went wrong during get requests",
error: { message: error.message },
});
}
});

const userupdate = app.put("/api/userupdate/:user_id", async (req, res) => {
const { user_id } = req.params;
const { nom, mail } = req.body;
try {
const finduser = await prisma.user.findUnique({
where: {
user_id,
},
});

    const putuser = await prisma.user.update({
      where: { user_id },
      data: {
        nom,
        mail,
      },
    });

    res.status(201).json({
      message: "user update successfully",
      putuser,
    });

    if (!finduser) {
      res.status(404).json({
        message: "user does not exit",
        error: { message: error.message },
      });
    }

} catch (error) {
res.status(500).json({ message: error.message });
}
});

async function finder(user_id) {
return await prisma.user.findUnique({
where: {
user_id: user_id,
},
});
}
const user5delete = app.delete("/api/userdelete/:user_id", async (req, res) => {
try {
const { user_id } = req.params;
finder(user_id);
if (!finder) {
res.status(204).json({
message: "User doesn't exit in db",
});
}
const deleted = await prisma.user.delete({
where: {
user_id: user_id,
},
});
res.status(202).json({
message: "user deleted successfully",
deleted,
});
} catch (error) {
res.status(500).json({
message: "error durring delete request",
error: { message: error.message },
});
}
});
module.exports = { createuser, getuser, getuser_byid, userupdate };
