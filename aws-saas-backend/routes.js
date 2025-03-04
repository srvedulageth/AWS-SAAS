const express = require("express");
const { uploadFile, listFiles, deleteFile } = require("./services/s3Service");
const { getItems, addItem } = require("./services/dynamoDBService");
const authMiddleware = require("./middlewares/authMiddleware");

const router = express.Router();

// S3 Routes
router.post("/upload", authMiddleware, uploadFile);
router.get("/files", authMiddleware, listFiles);
router.delete("/file/:key", authMiddleware, deleteFile);

// DynamoDB Routes
router.get("/items", authMiddleware, getItems);
router.post("/item", authMiddleware, addItem);

module.exports = router;
