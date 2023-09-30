const blogModel = require('../models/blog');
const _ = require('lodash');

// Define a caching period in milliseconds.
const CACHE_PERIOD = 5 * 60 * 1000; // 5 minutes

// Function to fetch and analyze blog data.
const fetchAndAnalyzeBlogData = async () => {
    const blogData = await blogModel.fetchBlogData();

    if (!blogData) {
        throw new Error('No blog data available.');
    }

    const totalBlogs = blogData.length;
    const blogWithLongestTitle = _.maxBy(blogData, (blog) => blog.title.length);
    const blogsWithPrivacyTitle = _.filter(blogData, (blog) => {
        if (blog.title && typeof blog.title === 'string') {
            return _.includes(blog.title.toLowerCase(), 'privacy');
        }
        return false;
    });
    const uniqueBlogTitles = _.uniqBy(blogData, 'title');

    return {
        totalBlogs,
        blogWithLongestTitle,
        numberOfBlogsWithPrivacyTitle: blogsWithPrivacyTitle.length,
        uniqueBlogTitles,
    };
};

// Function to search for blogs based on a query.
const searchBlogs = async (query) => {
    const blogData = await blogModel.fetchBlogData();

    if (!blogData) {
        throw new Error('No blog data available for search.');
    }

    const matchingBlogs = _.filter(blogData, (blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
    );

    return matchingBlogs;
};

// Use Lodash's memoize to cache the results of fetchAndAnalyzeBlogData and searchBlogs.
const memoizedFetchAndAnalyzeBlogData = _.memoize(fetchAndAnalyzeBlogData, undefined, CACHE_PERIOD);
const memoizedSearchBlogs = _.memoize(searchBlogs, undefined, CACHE_PERIOD);

// Controller function to get statistics about the blogs using cached data.
const getBlogStats = async (req, res) => {
    try {
        const blogStats = await memoizedFetchAndAnalyzeBlogData();

        res.json(blogStats);
    } catch (error) {
        console.error('Error fetching and analyzing blog data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to search for blogs based on a query parameter using cached data.
const getBlogSearch = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Invalid query parameter' });
        }

        const matchingBlogs = await memoizedSearchBlogs(query);

        res.json(matchingBlogs);
    } catch (error) {
        console.error('Error searching for blogs:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Export the controller functions for use in routes.
module.exports = {
    getBlogStats,
    getBlogSearch,
};
