import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ✅ Ensure uploads folder exists (same as in blog.routes.js)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads folder at:", uploadDir);
} else {
  console.log("📁 Uploads folder already exists at:", uploadDir);
}

app.use(cors({
    origin: ["http://localhost:5173",
        "https://d-evc-on-blog-seven.vercel.app"
    ],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Serve uploaded images statically (absolute path)
app.use("/uploads", express.static(uploadDir));

const PORT = process.env.PORT || 5000;

// existing routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// blog routes (categories & create-blog)
app.use("/api", blogRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listening to PORT ${PORT}`);
            console.log(`📁 Uploads served from: ${uploadDir}`);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();