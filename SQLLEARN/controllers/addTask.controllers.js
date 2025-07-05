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
    res.status(201).json({ message: "User creat successfully", usercreation });
  } catch (error) {
    res.status(500).json({
      Message: "Error during user creation",
      error: { message: error.message },
    });
  }
};
