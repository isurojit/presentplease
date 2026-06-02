const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

router.use(verifyToken);

// Upsert user on login
router.post('/sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.user;
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { uid, email, displayName, photoURL } },
      { upsert: true, new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
