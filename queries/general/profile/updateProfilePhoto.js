import express from 'express';
import pool from '../../creatDatabase/db.js'; 

const updateProfilePhoto = express.Router();

// هون بضيف صوره المستخدم او بغيرها
// Update user's profile photo
updateProfilePhoto.put('/:id', (req, res) => {
  const userId = req.params.id;
  const { profile_photo_path } = req.body;

  const query = `
    UPDATE users
    SET profile_photo_path = ?
    WHERE id = ?
  `;

  pool.execute(query, [profile_photo_path, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update' });
    }

    res.json({ message: 'User profile photo updated successfully' });
  });
});

export default updateProfilePhoto;