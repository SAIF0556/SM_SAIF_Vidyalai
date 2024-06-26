const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    // Fetch images and user details for each post using map and Promise.all
    const postsWithDetailsPromises = posts.map(async post => {
      // Fetch images
      const imageResponse = await axios.get(
        `https://jsonplaceholder.typicode.com/albums/${post.id}/photos`,
      );
      const images = imageResponse.data.map(photo => ({
        url: photo.url,
      }));

      // Fetch user details
      const user = await fetchUserById(post.id);

      return {
        ...post,
        images: images.slice(0, 3), // Limiting to 3 images per post for simplicity
        user,
      };
    });

    // Wait for all promises to resolve
    const postsWithDetails = await Promise.all(postsWithDetailsPromises);

    res.json(postsWithDetails);
  } catch (error) {
    console.error('Error fetching posts, images, or users:', error);
    res.status(500).json({
      error: 'An error occurred while fetching posts, images, or users',
    });
  }
});

module.exports = router;
