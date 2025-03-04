const AWS = require("aws-sdk");

const s3 = new AWS.S3();

exports.uploadFile = async (req, res) => {
    try {
        const { fileName, fileContent } = req.body;

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `uploads/${fileName}`,
            Body: Buffer.from(fileContent, "base64"),
            ACL: "public-read",
        };

        await s3.upload(params).promise();
        res.json({ message: "File uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listFiles = async (req, res) => {
    try {
        const params = { Bucket: process.env.S3_BUCKET_NAME, Prefix: "uploads/" };
        const data = await s3.listObjectsV2(params).promise();
        res.json(data.Contents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const params = { Bucket: process.env.S3_BUCKET_NAME, Key: req.params.key };
        await s3.deleteObject(params).promise();
        res.json({ message: "File deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
