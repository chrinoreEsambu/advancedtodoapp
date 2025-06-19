const argon2 = require("argon2");
const prisma = require("../config/prismaClient");
const session = require("express-session");

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
      hachLegth: 50,
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
};

exports.getUser = async (req, res) => {
  try {
    const findalluser = await prisma.user.findMany({
      // skip:1,
      // take:2
    });
    if (findalluser.length > 0) {
      res.status(200).json({ message: "All user", findalluser });
    } else {
      res.status(204).json({ message: "nothing find", findalluser });
    }
  } catch (error) {
    if (findalluser > 0) {
    }
    res.status(500).json({
      Message: "error durring getuser request",
      error: { message: error.message },
    });
  }
};

exports.getUserByid = async (req, res) => {
  try {
    const { user_id } = req.params;
    const findbyid = await prisma.user.findUnique({
      where: {
        user_id,
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
};

exports.userDelete = async (req, res) => {
  async function finder(user_id) {
    return await prisma.user.findUnique({
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
};

exports.connexion = async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const userfinder = await prisma.user.findUnique({
      where: { user_id },
    });
    if (!userfinder) {
      return res.status(401).json({ message: "User not found" });
    }
    const compare = await argon2.verify(userfinder.password, password);

    if (compare) {
      req.session.user_id = user_id;
      return res.status(200).json({ message: "bienvenue", user: user_id });
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
          message: "logout during logout request",
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
      res
        .status(401)
        .json({ message: "you need to be connect to your acount" });
    }
    const Alltasks = await prisma.task.findMany({
      where: {
        user_id: user_id,
      },
    });
    res.status(200).json({
      message: `User ${user_id} your task are`,
      tasks: Alltasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tâches",
      error: { message: error.message },
    });
  }
};
