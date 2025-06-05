const argon2 = require("argon2");
const prisma = require("../config/prismaClient");

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
};

exports.getUser = async (req, res) => {
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
      res.status(204).json({ message: "user not found"});
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

async function finder(user_id) {
  return await prisma.user.findUnique({
    where: {
      user_id: user_id,
    },
  });
}
exports.userDelete = async (req, res) => {
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
};
// module.exports = { createuser, getuser, getuser_byid, userupdate };
