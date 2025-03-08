import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-west-1" }); // Set your AWS region
const BUCKET_NAME = "my-saas-app-bucket"; // Replace with your actual S3 bucket

export const handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        if (!event.pathParameters || !event.pathParameters.fileKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing fileKey in request" }),
            };
        }

        const fileKey = decodeURIComponent(event.pathParameters.fileKey); // Handle URL encoding

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
        });

        await s3.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "File deleted successfully", fileKey }),
        };
    } catch (error) {
        console.error("Error deleting file:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
