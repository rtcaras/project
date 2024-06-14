const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel'); // Assuming you have a Blog model

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
    const { title, content, author } = req.body;

    // Validate input
    if (!title || !content || !author) {
        return res.status(400).json({ message: 'Title, content, and author are required' });
    }

    // Create new blog post
    const blog = new Blog({
        title,
        content,
        author,
    });

    try {
        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Blogs
const getBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Single Blog
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.author = author || blog.author;

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }

    try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
};
