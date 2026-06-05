import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authMiddleware = {
  verifyToken: async (req, res, next) => {
    try {
      console.log("Cookies:", req.cookies);

      const token = req.cookies.myCookie;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token does not exist!",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User does not exist!",
        });
      }

      req.user = user;

      next();
    } catch (error) {
      console.log(error);

      return res.status(401).json({
        success: false,
        message: "Access denied!",
      });
    }
  },

  // Allow either a single role string or an array of roles
  authRole: (allowedRoles) => {
    return (req, res, next) => {
      // Convert to array if single string
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      console.log("Current Role:", req.user?.userRole);
      console.log("Allowed Roles:", roles);

      if (!req.user || !roles.includes(req.user.userRole)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      next();
    };
  },
};