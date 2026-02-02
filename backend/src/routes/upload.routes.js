const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // preserve extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Return the path accessible via static serving
  const relativePath = `/uploads/${req.file.filename}`;
  // You might want to return full URL or just path. For now, path.
  // Assuming the client will prepend domain or use it as is if same domain.
  // Actually, client is localhost:3000 (FE), server is localhost:3001 ?
  // Need to check ports.
  // Usually full URL is safer if on different ports, but path is fine if stored in DB.

  res.json({
    message: "File uploaded successfully",
    path: relativePath,
    filename: req.file.filename,
  });
});

module.exports = router;
