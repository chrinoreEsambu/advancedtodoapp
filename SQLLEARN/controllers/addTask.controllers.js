const prisma = require("../config/prismaClient");
const session = require("express-session");

exports.addtask = async (req, res) => {
  try {
    const { task } = req.body;
    const user_id = req.session.user_id;
    if (!user_id) {
      return res.status(401).json({ message: "Utilisateur non connecté" });
    }
    const newtask = await prisma.task.create({
      data: {
        task,
        user: {
          connect: {
            user_id: user_id,
          },
        },
      },
    });
    res.status(201).json({ message: "Tâche ajoutée", task: newtask });
  } catch (error) {
    res.status(500).json({
      message: "error during the request",
      error: { message: error.message },
    });
  }
};
