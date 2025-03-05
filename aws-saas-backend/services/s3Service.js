const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
});

// S3 Bucket Name
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
if (!BUCKET_NAME) {
    throw new Error("S3_BUCKET_NAME is not set in environment variables");
}

// Upload File to S3
exports.uploadFile = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        if (!fileName || !fileType) {
            return res.status(400).json({ error: "Missing fileName or fileType" });
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            ContentType: fileType,
	    Expires: 300,
        };

        const uploadURL = await s3.getSignedUrlPromise("putObject", params);
        res.json({ uploadURL, fileName });
    } catch (error) {
        console.error("S3 Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// List Files in S3 Bucket
exports.listFiles = async (req, res) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
        };

        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(file => ({
            fileName: file.Key,
            lastModified: file.LastModified,
            size: file.Size,
        }));

        res.json(files);
    } catch (error) {
        console.error("S3 List Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete File from S3
exports.deleteFile = async (req, res) => {
    try {
        console.log("Request Params:", req.params); // Debugging
        console.log("Raw URL:", req.originalUrl); // Debugging
        console.log("Received delete request for file:", req.params.fileName); // Debugging

        const fileName = req.params.fileName;
        console.log("Received delete request for file 2:", fileName); // Debugging

        if (!fileName) {
            return res.status(400).json({ error: "Missing fileName" });
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: decodeURIComponent(fileName),
        };
        console.log("Attempting to delete file with params:", params); // Debugging

        await s3.deleteObject(params).promise();
        res.json({ message: "File deleted successfully!" });
	    console.log("file deleted", fileName);
    } catch (error) {
        console.error("S3 Delete Error:", error);
        res.status(500).json({ error: error.message });
    }
};
