import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-west-1" }); // Set your AWS region
const BUCKET_NAME = "my-saas-app-bucket"; // Replace with your actual S3 bucket

export const handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: "uploads/", // Optional: Only list files under "uploads/"
        });

        const data = await s3.send(command);
        const files = data.Contents ? data.Contents.map(file => ({
            fileName: file.Key,
            url: `https://${BUCKET_NAME}.s3.amazonaws.com/${file.Key}`
        })) : [];

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(files),
        };
    } catch (error) {
        console.error("Error listing files:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
