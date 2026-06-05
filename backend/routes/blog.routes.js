import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Category from '../models/category.model.js';
import Blog from '../models/blog.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Use absolute path to backend root (two levels up from routes folder)
const backendRoot = path.resolve(__dirname, '..'); // because this file is in routes/
const uploadDir = path.join(backendRoot, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads folder at:', uploadDir);
} else {
  console.log('📁 Uploads folder already exists at:', uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('💾 Saving file to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = unique + path.extname(file.originalname);
    console.log('📄 Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage });

// ---------- CATEGORY ROUTES ----------
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Category name required' });
    const exists = await Category.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (exists) return res.status(400).json({ error: 'Category already exists' });
    const category = new Category({ name: name.trim() });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    const blogsUsing = await Blog.findOne({ category: id });
    if (blogsUsing) {
      return res.status(400).json({ error: 'Cannot delete category that has blogs assigned. Reassign or delete those blogs first.' });
    }
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- CREATE BLOG (with better Multer error handling) ----------
router.post('/admin/create-blog', (req, res, next) => {
  upload.single('blogImage')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { blogTitle, blogDescription, blogContent, categoryId } = req.body;

    console.log('📝 Request body:', req.body);
    console.log('📎 Uploaded file:', req.file);

    if (!blogTitle || !blogDescription || !blogContent || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Blog image required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const blogImage = `/uploads/${req.file.filename}`;
    const newBlog = new Blog({
      blogTitle,
      blogDescription,
      blogContent,
      blogImage,
      category: categoryId,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('🔥 Create blog error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- GET SINGLE BLOG (for editing) ----------
router.get('/admin/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }
    const blog = await Blog.findById(id).populate('category', 'name');
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Fetch single blog error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- UPDATE BLOG ----------
router.put('/admin/update-blog/:id', upload.single('blogImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { blogTitle, blogDescription, blogContent, categoryId } = req.body;

    if (!blogTitle || !blogDescription || !blogContent || !categoryId) {
      return res.status(400).json({ error: 'Title, description, content and category are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const updateData = {
      blogTitle,
      blogDescription,
      blogContent,
      category: categoryId,
    };

    if (req.file) {
      updateData.blogImage = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedBlog) return res.status(404).json({ error: 'Blog not found' });

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('🔥 Update blog error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- GET ALL BLOGS (for admin) ----------
router.get('/admin/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Fetch blogs error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- DELETE BLOG ----------
router.delete('/admin/delete-blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- PUBLIC ROUTES ----------
router.get('/blogs', async (req, res) => {
  try {
    const { limit = 10, page = 1, category } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }
    const blogs = await Blog.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Blog.countDocuments(query);
    res.json({ blogs, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('Fetch public blogs error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }
    const blog = await Blog.findById(id).populate('category', 'name');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error('Fetch single blog error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;