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
    console.error("Error logger :", error);
  }
};

module.exports = { logAdminAction };
