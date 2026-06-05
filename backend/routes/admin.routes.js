import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createBlog, loginAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

// Public admin login
router.post("/admin-login", loginAdmin);

// Protected admin‑only routes
router.post("/create-blog",
    authMiddleware.verifyToken,
    authMiddleware.authRole("admin"),   // ✅ single role string works too
    upload.single("blogImage"),
    createBlog);

router.post('/logout', (req, res) => {
    res.clearCookie('myCookie', { path: '/' });
    res.status(200).json({ success: true, message: 'Logged out' });
});

export default router;