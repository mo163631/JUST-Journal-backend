const express = require('express');
const db = require('../db');

const updateProfilePhoto = express.Router();

// هون بضيف صوره المستخدم او بغيرها
// Update user's profile photo
updateProfilePhoto.put('/:id/photo', (req, res) => {
  const userId = req.params.id;
  const { profile_photo_path } = req.body;

  const query = `
    UPDATE users
    SET profile_photo_path = ?
    WHERE id = ?
  `;

  db.execute(query, [profile_photo_path, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update' });
    }

    res.json({ message: 'User profile photo updated successfully' });
  });
});
export default updateProfilePhoto;