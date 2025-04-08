// config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'student-images',
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png, jpeg, jpg', 
        public_id: (req, file) => file.originalname.split('.')[0],
      },
  }
});

const multerUploads = multer({ storage: storage });

module.exports = multerUploads;
