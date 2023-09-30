const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Define the route for getting blog statistics.
router.get('/blog-stats', blogController.getBlogStats);

// Define the route for searching blogs.
router.get('/blog-search', blogController.getBlogSearch);

module.exports = router;
