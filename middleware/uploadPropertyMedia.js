const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/properties');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueName}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif'
    ];
    const allowedVideoTypes = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo'
    ];

    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error('Only JPEG, PNG, WEBP, GIF, MP4, WEBM, MOV, and AVI files are allowed'));
};

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        files: 20,
        fileSize: 100 * 1024 * 1024
    }
});