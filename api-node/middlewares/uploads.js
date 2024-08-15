const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg and .png files are allowed!'));
  }
});


const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file uploaded.'));
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);

  try {
    await sharp(filePath)
      .resize({ width: 500, height: 500, fit: sharp.fit.inside, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer((err, buffer) => {
        if (err) throw err;
        fs.writeFileSync(filePath, buffer);
      });

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, resizeImage };
