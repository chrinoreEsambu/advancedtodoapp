const prisma = require("../config/prismaClient");
const session = require("express-session");

const logAdminAction = async (adminId, action, details) => {
    try {
       f (!adminId) {
      console.warn("Admin non identifié. Impossible de logger l'action.");
      return;
    }
    } catch (error) {
        
    }
};