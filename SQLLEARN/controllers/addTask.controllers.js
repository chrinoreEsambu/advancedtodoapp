const prisma = require("../config/prismaClient");
const session = require("express-session");
const { logAdminAction } = require("../log/logger.controller");
const argon2 = require("argon2");

exports.addtask = async (req, res) => {
  try {
    const { task, description, state } = req.body;
    const user_id = req.session.user_id;

    if (!user_id) {
      return res.status(401).json({ message: "Utilisateur non connecté" });
    }

    const newtask = await prisma.tasks.create({
      data: {
        task,
        description,
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
//   try {
//     const { taskId } = req.params;
//     const { state } = req.body;
//     const role = req.session?.role;

//     if (role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Accès réservé aux administrateurs" });
//     }

//     const updatedTask = await prisma.tasks.update({
//       where: { task_id: taskId },
//       data: { state },
//       include: {
//         creator: true,
//         assignedBy: true,
//         assignee: true,
//       },
//     });

//     return res.status(200).json({
//       message: "État de la tâche mis à jour",
//       task: updatedTask,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Erreur lors de la mise à jour de l'état",
//       error: { message: error.message },
//     });
//   }
// };

exports.userTasksCount = async (req, res) => {
  try {
    const totalUsers = await prisma.users.count();
    const totalAdmin = await prisma.users.count({ where: { role: "admin" } });
    const totalNormalUsers = await prisma.users.count({
      where: { role: "users" },
    });
    const totaltasks = await prisma.tasks.count();
    return res.status(200).json({
      message: "totalCouns",
      totalUsers,
      totalAdmin,
      totalNormalUsers,
      totaltasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'état",
      error: { message: error.message },
    });
  }
};

exports.adminCreateUser = async (req, res) => {
  try {
    const { nom, mail, password, role } = req.body;
    const date = new Date().getFullYear();
    const suffix = Math.floor(100 + Math.random() * 900);
    const user_id = `${date}todox${suffix}`;
    const finalrole = role || "users";

    const hachpass = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 * 12,
      timeCost: 2,
      hashLegth: 50,
      parallelism: 3,
    });

    const usercreation = await prisma.users.create({
      data: {
        user_id,
        nom,
        mail,
        password: hachpass,
        role: finalrole,
      },
    });

    await logAdminAction(
      req.session.admin_id,
      "création utilisateur",
      `a créé l'utilisateur ${usercreation.user_id} (${usercreation.nom})`,
    );

    res.status(201).json({ message: "User creat successfully", usercreation });
  } catch (error) {
    res.status(500).json({
      Message: "Error during user creation",
      error: { message: error.message },
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user_id = req.session.user_id;

    if (!user_id) {
      return res.status(401).json({ message: "Utilisateur non connecté" });
    }

    // Vérifier que la tâche appartient à l'utilisateur
    const task = await prisma.tasks.findUnique({
      where: { task_id: taskId },
    });

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    if (task.assigneeId !== user_id) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez supprimer que vos propres tâches" });
    }

    // Supprimer les commentaires liés à la tâche d'abord
    await prisma.comments.deleteMany({
      where: { taskId: taskId },
    });

    // Supprimer la tâche
    const deletedTask = await prisma.tasks.delete({
      where: { task_id: taskId },
    });

    res.status(200).json({
      message: "Tâche supprimée avec succès",
      deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la tâche",
      error: { message: error.message },
    });
  }
};

exports.adminDeleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const role = req.session?.role;

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }

    // Vérifier que la tâche existe
    const task = await prisma.tasks.findUnique({
      where: { task_id: taskId },
    });

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Supprimer les commentaires liés à la tâche d'abord
    await prisma.comments.deleteMany({
      where: { taskId: taskId },
    });

    // Supprimer la tâche
    const deletedTask = await prisma.tasks.delete({
      where: { task_id: taskId },
    });

    await logAdminAction(
      req.session.admin_id,
      "suppression tâche",
      `a supprimé la tâche ${deletedTask.task} (ID: ${deletedTask.task_id})`,
    );

    res.status(200).json({
      message: "Tâche supprimée avec succès",
      deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la tâche",
      error: { message: error.message },
    });
  }
};

// Ajouter un commentaire admin sur une tâche
exports.adminAddTaskComment = async (req, res) => {
  try {
    console.log("=== adminAddTaskComment appelé ===");
    console.log("Body reçu:", req.body);
    console.log("Session admin_id:", req.session?.admin_id);

    const { taskId, commentText } = req.body;

    // Vérifier que tous les champs sont fournis
    if (!taskId || !commentText) {
      return res.status(400).json({
        message: "ID de tâche et texte du commentaire requis",
      });
    }

    // Vérifier que l'administrateur est connecté
    if (!req.session.admin_id) {
      return res.status(401).json({
        message: "Session administrateur requise",
      });
    }

    // Vérifier que la tâche existe
    const task = await prisma.tasks.findUnique({
      where: { task_id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        message: "Tâche non trouvée",
      });
    }

    // Créer le commentaire
    const comment = await prisma.comments.create({
      data: {
        content: commentText,
        taskId: taskId,
        authorId: req.session.admin_id,
        createdAt: new Date(),
      },
      include: {
        author: {
          select: {
            user_id: true,
            nom: true,
            mail: true,
          },
        },
        task: {
          select: {
            task_id: true,
            task: true,
          },
        },
      },
    });

    console.log("Commentaire créé avec succès:", comment);

    // Logger l'action admin
    await logAdminAction(
      req.session.admin_id,
      "ajout commentaire",
      `a ajouté un commentaire sur la tâche ${task.task} (ID: ${task.task_id})`,
    );

    res.status(200).json({
      message: "Commentaire ajouté avec succès",
      comment,
    });
  } catch (error) {
    console.error("=== Erreur dans adminAddTaskComment ===");
    console.error("Erreur complète:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: "Erreur lors de l'ajout du commentaire",
      error: { message: error.message },
    });
  }
};
