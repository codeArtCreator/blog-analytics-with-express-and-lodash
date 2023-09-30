const axios = require('axios');

// Function to fetch blog data from an external API.
const fetchBlogData = async () => {
    try {
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch blog data. Status code: ${response.status}`);
        }
        return response?.data?.blogs;
    } catch (error) {
        console.error('Error fetching blog data:', error.message);
        throw new Error('Failed to fetch blog data. Please try again later.');
    }
};
module.exports = {
    fetchBlogData,
};
