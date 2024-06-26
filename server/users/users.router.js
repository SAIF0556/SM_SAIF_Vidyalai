const express = require('express');
const { fetchAllUsers, fetchUserById } = require('./users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await fetchAllUsers();

  res.json(users);
});

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await fetchUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: `Error fetching user with ID ${userId}` });
  }
});

module.exports = router;
