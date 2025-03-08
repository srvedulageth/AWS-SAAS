import axios from "axios";

const API_ENDPOINT = "https://https://zd9b7so052.execute-api.us-west-1.amazonaws.com/mysaasapistage-1/s3"; // Replace with actual API Gateway URL

export const getPresignedUrl = async (file) => {
    try {
        const response = await axios.post(API_ENDPOINT, {
            fileName: file.name,
            fileType: file.type,
        });

        return response.data.uploadURL || null;
    } catch (error) {
        console.error("Error getting pre-signed URL:", error);
        return null;
    }
};
