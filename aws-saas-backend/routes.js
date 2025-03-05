const express = require("express");
const router = express.Router();

const s3Service = require("./services/s3Service");
const authMiddleware = require("./middlewares/authMiddleware");

const { getItems, addItem } = require("./services/dynamoDBService");


// S3 Routes
router.post("/s3/upload", authMiddleware, s3Service.uploadFile);
router.get("/s3/list", authMiddleware, s3Service.listFiles);
router.delete("/s3/delete/:fileName", authMiddleware, s3Service.deleteFile);


// DynamoDB Routes
router.get("/items", authMiddleware, getItems);
router.post("/item", authMiddleware, addItem);

module.exports = router;
