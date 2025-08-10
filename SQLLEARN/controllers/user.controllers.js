const argon2 = require("argon2");
const prisma = require("../config/prismaClient");
const session = require("express-session");
const { logAdminAction } = require("../log/logger.controller");

exports.createUser = async (req, res) => {
  try {
    const { nom, mail, password } = req.body;
    const date = new Date().getFullYear();
    const suffix = Math.floor(100 + Math.random() * 900);
    const user_id = `${date}todox${suffix}`;

    const hachpass = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 * 12,
      timeCost: 2,
      hashLength: 50,
      parallelism: 3,
    });

    const usercreation = await prisma.users.create({
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
};

exports.getUser = async (req, res) => {
  try {
    const role = req.session?.role;
    if (role !== "admin") {
      return res.status(401).json({ message: "Aucune session admin ouverte" });
    }
    const findalluser = await prisma.users.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (findalluser.length > 0) {
      // await logAdminAction(
      //   req.session.admin_id,
      //   "récupération utilisateurs",
      //   `consultation la liste des utilisateurs`
      // );
      res.status(200).json({ message: "All user", findalluser });
    } else {
      res.status(204).json({ message: "nothing find", findalluser });
    }
  } catch (error) {
    res.status(500).json({
      Message: "error durring getuser request",
      error: { message: error.message },
    });
  }
};

exports.getUserByid = async (req, res) => {
  try {
    const { user_id } = req.params;
    const findbyid = await prisma.users.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (!findbyid) {
      res.status(204).json({ message: "user not found" });
    } else {
      res.status(200).json({ message: "User Found", findbyid });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong during get requests",
      error: { message: error.message },
    });
  }
};

exports.userUpdate = async (req, res) => {
  const { user_id } = req.params;
  const { nom, mail } = req.body;
  try {
    const finduser = await prisma.users.findUnique({
      where: {
        user_id: user_id,
      },
    });

    const putuser = await prisma.users.update({
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
};

exports.userDelete = async (req, res) => {
  async function finder(user_id) {
    return await prisma.users.findUnique({
      where: {
        user_id: user_id,
      },
    });
  }
  try {
    const { user_id } = req.params;
    finder(user_id);
    if (!user_id) {
      res.status(204).json({
        message: "User doesn't exit !",
      });
    }
    const deleted = await prisma.users.delete({
      where: {
        user_id: user_id,
      },
    });

    await logAdminAction(
      req.session.admin_id,
      "suppression utilisateur",
      `suppression utilisateur ${deleted.user_id} (${deleted.nom})`
    );

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
};

exports.connexion = async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const userfinder = await prisma.users.findUnique({
      where: { mail: user_id },
    });

    if (!userfinder) {
      return res.status(401).json({ message: "User not found" });
    }

    const compare = await argon2.verify(userfinder.password, password);

    if (compare) {
      req.session.user_id = userfinder.user_id;
      return res
        .status(200)
        .json({ message: "bienvenue", user: userfinder.user_id });
    } else {
      return res
        .status(401)
        .json({ message: "mot de passe ou userId incorrect" });
    }
  } catch (error) {
    res.status(500).json({
      message: "error during connexion",
      error: { message: error.message },
    });
  }
};

exports.logOut = async (req, res) => {
  try {
    const { user_id } = req.body;
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "error during logout request",
          error: { message: error.message },
        });
      }
      res.clearCookie("connect.sid");
      return res
        .status(200)
        .json({ message: "Logout successful", user_id: user_id });
    });
  } catch (error) {
    res.status(500).json({
      message: "error during logout request",
      error: { message: error.message },
    });
  }
};

exports.getusertasks = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    if (!user_id) {
      return res
        .status(401)
        .json({ message: "Vous devez être connecté à votre compte" });
    }

    const tasks = await prisma.tasks.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        assigneeId: user_id,
        state: "delivered",
      },
      include: {
        creator: true,
        assignedBy: true,
        assignee: true,
      },
    });

    return res.status(200).json({
      message: "Vos tâches assignées",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des tâches",
      error: { message: error.message },
    });
  }
};

// ADMIN PARTS
exports.updateTasksState = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { taskState } = req.body;

    const existingTask = await prisma.tasks.findUnique({
      where: { task_id },
      select: {
        taskState: true,
      },
    });

    if (!existingTask) {
      return res
        .status(404)
        .json({ message: "Aucune tâche avec cet ID trouvée." });
    }

    if (existingTask.taskState === "done") {
      return res.status(403).json({
        messageT:
          "Les tâches déjà terminées (done) ne peuvent plus être modifiées.",
      });
    }

    const updatedTask = await prisma.tasks.update({
      where: { task_id },
      data: { taskState },
    });

    await logAdminAction(
      req.session.admin_id,
      "modification état tâche",
      `a modifié l'état de la tâche ${task_id} à ${taskState}`
    );

    return res.status(200).json({ updatedTask });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
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

    await logAdminAction(
      req.session.admin_id,
      "creation utilisateur",
      `a créé l'utilisateur ${usercreation.user_id} (${usercreation.nom})`
    );
  } catch (error) {
    res.status(500).json({
      Message: "Error during user creation",
      error: { message: error.message },
    });
  }
};

exports.adminconnexion = async (req, res) => {
  try {
    const { mail, password } = req.body;

    const userfinder = await prisma.users.findUnique({
      where: { mail },
    });

    if (!userfinder) {
      return res.status(404).json({
        message: "Sorry, you are not allowed to log in to the admin section.",
      });
    }
    const compare = await argon2.verify(userfinder.password, password);
    if (!compare) {
      return res
        .status(401)
        .json({ message: "mot de passe ou mail incorrect" });
    }
    if (userfinder.role.toLocaleLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }
    req.session.mail = userfinder.mail;
    req.session.role = userfinder.role;
    req.session.admin_id = userfinder.user_id;

    await logAdminAction(
      req.session.admin_id,
      "connexion admin",
      `admin ${userfinder.mail}`
    );

    return res.status(200).json({
      message: "Bienvenue admin",
      user: {
        user_mail: userfinder.mail,
        role: userfinder.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "error during admin connexion",
      error: { message: error.message },
    });
  }
};

exports.admincreatTask = async (req, res) => {
  try {
    const role = req.session?.role;
    const admin_id = req.session?.admin_id;

    if (!role || role.toLowerCase() !== "admin" || !admin_id) {
      return res
        .status(403)
        .json({ message: "Accès refusé : admin uniquement" });
    }

    const { user_id, task, description, state } = req.body;

    const userfind = await prisma.users.findUnique({
      where: { user_id },
    });

    if (!userfind) {
      return res.status(404).json({ message: "Utilisateur cible non trouvé" });
    }

    const newTask = await prisma.tasks.create({
      data: {
        task,
        description,
        state: state || "pending",
        creator: {
          connect: {
            user_id: admin_id,
          },
        },
        assignedBy: {
          connect: {
            user_id: admin_id,
          },
        },
        assignee: {
          connect: {
            user_id: user_id,
          },
        },
      },
      include: {
        creator: true,
        assignedBy: true,
        assignee: true,
      },
    });

    await logAdminAction(
      req.session.admin_id,
      "création tâche",
      `A assigné une tâche à l'utilisateur ${user_id} (${userfind.nom})`
    );

    return res.status(201).json({
      message: "Tâche créée et assignée avec succès",
      task: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la création de la tâche",
      error: { message: error.message },
    });
  }
};

exports.getusertasksfront = async (req, res) => {
  try {
    const user_id = req.session.user_id || req.session.admin_id;
    const role = req.session?.role;

    if (!user_id) {
      return res
        .status(401)
        .json({ message: "Vous devez être connecté à votre compte" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const jump = (page - 1) * limit;

    let tasks;
    if (role === "admin") {
      tasks = await prisma.tasks.findMany({
        orderBy: {
          createdAt: "desc",
        },

        skip: jump,
        take: limit,

        include: {
          creator: true,
          assignedBy: true,
          assignee: true,
        },
      });
    } else {
      tasks = await prisma.tasks.findMany({
        where: {
          OR: [{ assigneeId: user_id }, { creatorId: user_id }],
          state: "delivered",
        },
        include: {
          creator: true,
          assignedBy: true,
          assignee: true,
        },
      });
    }
    const nbrTasks = await prisma.tasks.count();
    const countTasks = Math.ceil(nbrTasks / limit);
    return res.status(200).json({
      message: role === "admin" ? "Toutes les tâches" : "Vos tâches",
      tasks,
      countTasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des tâches",
      error: { message: error.message },
    });
  }
};

exports.userTasksCount = async (req, res) => {
  try {
    const totalUsers = await prisma.users.count();
    const totalAdmin = await prisma.users.count({ where: { role: "admin" } });
    const totalNormalUsers = await prisma.users.count({
      where: { role: "users" },
    });
    const totaltasks = await prisma.tasks.count();

    // await logAdminAction(
    //   req.session.admin_id,
    //   "consultation statistiques",
    //   "a consulté les statistiques du système"
    // );

    return res.status(200).json({
      success: true,
      message: "totalCouns",
      stats: {
        totalUsers,
        totalAdmin,
        totalNormalUsers,
        totaltasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'état",
      error: { message: error.message },
    });
  }
};

exports.logOutAdmin = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la déconnexion" });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Déconnexion réussie" });
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
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

    const { taskId } = req.params;
    const { newState } = req.body;

    console.log("task_id = ", req.params);
    const task = await prisma.tasks.findUnique({ where: { task_id: taskId } });

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    const updatedTask = await prisma.tasks.update({
      where: { task_id: taskId },
      data: {
        state: newState,
      },
    });

    await logAdminAction(
      req.session.admin_id,
      "modification état tâche",
      `a changé l'état de la tâche ${taskId} à ${newState}`
    );

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

exports.addComments = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { content, replyToId, replyById } = req.body;

    const userId = req.session.user_id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const task = await prisma.tasks.findUnique({
      where: { task_id },
    });

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    if (task.assigneeId !== userId) {
      return res.status(403).json({
        message: "Tâche non autorisée pour cet utilisateur.",
      });
    }

    await prisma.comments.create({
      data: {
        content,
        taskId: task_id,
        authorId: userId,
        replyToId: replyToId || null,
        replyById: replyById || null,
      },
    });

    res.status(200).json({ message: "Commentaire enregistré avec succès." });
  } catch (error) {
    console.error("Erreur dans addComments :", error);
    res.status(500).json({
      message: "Erreur lors de la requête.",
      error: error.message,
    });
  }
};

exports.admStateFinder = async (req, res) => {
  try {
    const resTd = await prisma.tasks.findMany({
      where: { taskState: "todo" },
      orderBy: { createdAt: "desc" },
    });

    const resInp = await prisma.tasks.findMany({
      where: { taskState: "inprogress" },
      orderBy: { createdAt: "desc" },
    });

    const resDnd = await prisma.tasks.findMany({
      where: { taskState: "denied" },
      orderBy: { createdAt: "desc" },
    });

    const reAcc = await prisma.tasks.findMany({
      where: { taskState: "accepted" },
      orderBy: { createdAt: "desc" },
    });

    const resDone = await prisma.tasks.findMany({
      where: { taskState: "done" },
      orderBy: { createdAt: "desc" },
    });

    const resReq = await prisma.tasks.findMany({
      orderBy: { createdAt: "desc" },
    });
    const orderedTasks = resReq.sort((a, b) => {
      if (a.taskState === "request" && b.taskState !== "request") return -1;
      if (a.taskState !== "request" && b.taskState === "request") return 1;
      return 0;
    });

    res.status(200).json({
      message: "Tâches trouvées avec succès",
      elements: [resTd, resInp, resDnd, reAcc, resDone, resReq],
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tâches",
      error: { message: error.message },
    });
  }
};

exports.getAdminLogs = async (req, res) => {
  try {
    const role = req.session?.role;
    if (role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    // const limit = parseInt(req.query.limit) || 4;

    const jump = (page - 1) * limit;

    const logs = await prisma.logs.findMany({
      skip: jump,
      take: limit,

      orderBy: {
        createAt: "desc",
      },
    });
    const countlogs = await prisma.logs.count();
    const countPage = Math.ceil(countlogs / limit);

    return res
      .status(200)
      .json({ message: "Logs des actions admin", countPage, logs });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des logs",
      error: error.message,
    });
  }
};

exports.getAllMessages = async (req, res) => {
  const { user_id } = req.query;

  try {
    const getAllMessage = await prisma.comments.findMany({
      orderBy: { createdAt: "desc" },
      where: user_id ? { authorId: user_id } : {},
      select: {
        content: true,
        taskId: true,
        task: true,
        author: {
          select: { nom: true },
        },
        replyBy: {
          select: { nom: true },
        },
      },
    });

    res.status(200).json({ message: "okey", getAllMessage });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des messages.",
      error: error.message,
    });
  }
};

exports.replyToMessage = async (req, res) => {
  try {
    const { content, taskId } = req.body;
    const userId = req.session.user_id || req.session.admin_id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }
    let task = null;
    if (taskId) {
      task = await prisma.tasks.findUnique({
        where: { task_id: taskId },
        select: { task: true },
      });
    }

    const newMessage = await prisma.comments.create({
      data: {
        content,
        taskId: taskId || null,
        authorId: userId,
        replyById: userId,
      },
      include: {
        author: { select: { nom: true } },
      },
    });

    await logAdminAction(
      req.session.admin_id,
      "Commentaire sur tâche",
      `a commenté la tâche "${task ? task.task : taskId}" Par : "${content}"`
    );

    return res
      .status(201)
      .json({ message: "Message envoyé.", data: newMessage });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'envoi du message.",
      error: error.message,
    });
  }
};

exports.getCommentsByTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    if (!task_id) {
      return res.status(400).json({ message: "task_id requis" });
    }

    const comments = await prisma.comments.findMany({
      where: { taskId: task_id },
      orderBy: { createdAt: "desc" },
      select: {
        content: true,
        createdAt: true,
        author: {
          select: { nom: true },
        },
        replyBy: {
          select: { nom: true },
        },
      },
    });

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des commentaires.",
      error: error.message,
    });
  }
};
