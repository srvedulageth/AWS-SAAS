import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-west-1" }); // Set AWS region
const BUCKET_NAME = "my-saas-app-bucket"; // Replace with your actual S3 bucket

export const handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        //const fileKey = event.pathParameters?.fileKey; // Extract fileKey from path
        const fileKey = decodeURIComponent(event.pathParameters.fileKey);
        console.log("Decoded fileKey:", fileKey);
        const finalKey = fileKey.startsWith("uploads/") ? fileKey : `uploads/${fileKey}`;

        if (!finalKey) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Missing fileKey parameter" }),
            };
        }

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: finalKey,
        });

        await s3.send(command);
        console.log(`File deleted: ${fileKey}`);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: `File ${fileKey} deleted successfully` }),
        };
    } catch (error) {
        console.error("Error deleting file:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
