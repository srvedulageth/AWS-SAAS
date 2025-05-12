import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-west-1" }); // Set your AWS region
const BUCKET_NAME = "my-saas-app-bucket"; // Replace with your actual S3 bucket

export const handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        // Handle CORS Preflight (OPTIONS Request)
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
                body: "",
            };
        }

        if (!event.body) {
            throw new Error("Missing request body");
        }

        let requestBody;
        try {
            requestBody = JSON.parse(event.body);
        } catch (parseError) {
            console.error("Invalid JSON body:", parseError);
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ error: "Invalid JSON format" }),
            };
        }

        const { fileName, fileType } = requestBody;
        if (!fileName || !fileType) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ error: "Missing fileName or fileType" }),
            };
        }

        const key = `uploads/${Date.now()}-${fileName}`;

        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        };

        const command = new PutObjectCommand(params);
        const uploadURL = await getSignedUrl(s3, command, { expiresIn: 3000 }); // 5 min expiration

        console.log("Generated presigned URL:", uploadURL);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uploadURL, fileName: key }),
        };
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
