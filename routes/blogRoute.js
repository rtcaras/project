const express = require('express');
const { createBlog,
     getBlogs,
      getBlog,
       updateBlog, 
       deleteBlog } = require('../controllers/blogCtrl');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

console.log('Setting up blog routes');

router.post('/', protect, isAdmin, createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.put('/:id', protect, isAdmin, updateBlog);
router.delete('/:id', protect, isAdmin, deleteBlog);

module.exports = router;
