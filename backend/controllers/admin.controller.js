import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Blog from "../models/blog.model.js";
import Category from "../models/category.model.js"; // ✅ import Category model
import mongoose from "mongoose";                   // ✅ for ObjectId validation

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      return res.status(400).json({
        success: false,
        message: "Must Fill in Email and Password!",
      });
    }

    const user = await User.findOne({ userEmail }).select("+userPassword");

    if (!user) {
      return res.status(409).json({
        success: false,
        message: "Wrong Email or Password!",
      });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);

    if (!isMatch) {
      return res.status(409).json({
        success: false,
        message: "Wrong Email or Password!",
      });
    }

    if (user.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can login!",
      });
    }

    const token = jwt.sign(
      { id: user._id, userEmail: user.userEmail },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );

    res.cookie("myCookie", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: `Welcome Back ${user.userEmail}`,
      role: user.userRole,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while trying to login!",
    });
  }
};

// Create Blog (with category)
export const createBlog = async (req, res) => {
  try {
    const { user } = req;
    const { blogTitle, blogDescription, blogContent, categoryId } = req.body; // ✅ categoryId

    // Validate required fields
    if (!blogTitle || !blogDescription || !blogContent || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, description, content, category) are required!",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No Image Selected!",
      });
    }

    // Validate categoryId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format!",
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found! Please select a valid category.",
      });
    }

    // Use a clean image path (relative URL)
    const blogImage = `/uploads/${req.file.filename}`;

    const newBlog = new Blog({
      blogTitle,
      blogDescription,
      blogContent,
      blogImage,
      category: categoryId,    // ✅ store category reference
      author: user._id,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog Created!",
      blog: newBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the blog!",
    });
  }
};