import express from "express";
import { 
    changeAvatar,
    changePassword,
    checkCookie, 
    getProfileData, 
    loginUser, 
    logoutUser, 
    signUpUser 
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes
router.post("/sign-up", signUpUser);
router.post("/login", loginUser);
router.get("/check-cookie", checkCookie);
router.post("/logout", logoutUser);

// Protected routes – accessible to both user and admin
router.get("/getUserProfile",
    authMiddleware.verifyToken,
    authMiddleware.authRole(["user", "admin"]),   // ✅ allow both
    getProfileData);

router.put("/change-password",
    authMiddleware.verifyToken,
    authMiddleware.authRole(["user", "admin"]),   // ✅ allow both
    changePassword);

router.put("/change-avatar",
    authMiddleware.verifyToken,
    authMiddleware.authRole(["user", "admin"]),   // ✅ allow both
    upload.single("avatar"),
    changeAvatar);

export default router;