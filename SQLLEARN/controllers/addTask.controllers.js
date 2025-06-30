const prisma = require("../config/prismaClient");
const session = require("express-session");

exports.addtask = async (req, res) => {
  try {
    const { task, state } = req.body;
    const user_id = req.session.user_id;

    if (!user_id) {
      return res.status(401).json({ message: "Utilisateur non connecté" });
    }

    const newtask = await prisma.tasks.create({
      data: {
        task,
        state: state || "delivered",
        creatorId: user_id,
        assigneeId: user_id,
        assignedById: user_id,
      },
      include: {
        creator: true,
        assignee: true,
      },
    });

    res.status(201).json({
      message: "Tâche ajoutée avec succès",
      task: newtask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la tâche",
      error: { message: error.message },
    });
  }
};

