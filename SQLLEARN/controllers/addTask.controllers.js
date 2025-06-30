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

exports.adminUpdateTaskState = async (req, res) => {
  try {
    const role = req.session?.role;
    const admin_id = req.session?.admin_id;

    if (!role || role.toLowerCase() !== "admin" || !admin_id) {
      return res
        .status(403)
        .json({ message: "Accès refusé : admin uniquement" });
    }

    const { task_id } = req.params;
    const { newState } = req.body;

    const task = await prisma.tasks.findUnique({ where: { task_id } });
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    const updatedTask = await prisma.tasks.update({
      where: { task_id },
      data: {
        state: newState,
      },
    });

    return res.status(200).json({
      message: `État de la tâche mis à jour : ${newState}`,
      task: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de la tâche",
      error: { message: error.message },
    });
  }
};
