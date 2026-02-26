const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { minioClient, bucketName } = require("../utils/minio");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(req.file.originalname);

    // Upload to MinIO
    await minioClient.putObject(
      bucketName,
      filename,
      req.file.buffer,
      req.file.size,
      { "Content-Type": req.file.mimetype },
    );

    // Return the relative path and information
    // For MinIO, the path usually prefix with bucket
    const relativePath = `/uploads/${filename}`;

    // Full external URL (optional, can be constructed by FE)
    // Note: In docker environment, internal endpoint is 'minio',
    // but browser needs 'localhost' or external domain.
    const publicUrl = process.env.MINIO_PUBLIC_URL
      ? `${process.env.MINIO_PUBLIC_URL}/${bucketName}/${filename}`
      : `${req.protocol}://${req.get("host")}/upload/${bucketName}/${filename}`;

    res.json({
      message: "File uploaded successfully to MinIO",
      path: relativePath,
      filename: filename,
      url: publicUrl,
    });
  } catch (error) {
    console.error("MinIO upload error:", error);
    res.status(500).json({
      message: "Error uploading file to storage",
      error: error.message,
    });
  }
});

module.exports = router;
