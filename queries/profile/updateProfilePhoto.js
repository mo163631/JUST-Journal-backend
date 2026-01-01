import express from 'express';
import pool from '../creatDatabase/db.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const updateProfilePhoto = express.Router();

// إعداد Multer لتخزين الصورة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/profile_photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ========================
// تعديل صورة المستخدم
// ========================
updateProfilePhoto.put('/:id', upload.single('profile_photo'), async (req, res) => {
  const userId = req.params.id;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const profilePhotoPath = req.file.path;

  try {
    const query = `
      UPDATE users
      SET profile_photo_path = ?
      WHERE id = ?
    `;
    await pool.execute(query, [profilePhotoPath, userId]);
    res.json({ message: 'User profile photo updated successfully', path: profilePhotoPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile photo' });
  }
});

export default updateProfilePhoto;

// import express from 'express';
// import pool from '../creatDatabase/db.js'; 

// const updateProfilePhoto = express.Router();

// // هون بضيف صوره المستخدم او بغيرها
// // Update user's profile photo
// updateProfilePhoto.put('/:id', (req, res) => {
//   const userId = req.params.id;
//   const { profile_photo_path } = req.body;

//   const query = `
//     UPDATE users
//     SET profile_photo_path = ?
//     WHERE id = ?
//   `;

//   pool.execute(query, [profile_photo_path, userId], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Failed to update' });
//     }

//     res.json({ message: 'User profile photo updated successfully' });
//   });
// });

// export default updateProfilePhoto;