const prisma = require("../config/prismaClient");
const session = require("express-session");

const logAdminAction = async (adminId, action, details) => {
  try {
    if (!adminId) {
      console.warn("Admin non identifié. Impossible de logger l'action.");
      return;
    }

    await prisma.logs.create({
      data: {
        adminId,
        action,
        details,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error logger", error: { message: error.message } });
  }
};

module.exports = { logAdminAction };
