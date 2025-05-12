import axios from "axios";
import fetchWithAuth from "../api";

const API_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/s3`;
console.log(API_ENDPOINT);

export const getPresignedUrl = async (file) => {
    try {
        const data = {
            fileName: file.name,
            fileType: file.type,
        };

        const response = await fetchWithAuth("/s3", "POST", data);

        return response.uploadURL || null;
    } catch (error) {
        console.error("Error getting pre-signed URL:", error);
        return null;
    }
};

export const uploadFileToS3 = async (file, uploadURL) => {
    try {
        const response = await axios.put(uploadURL, file, {
            headers: { "Content-Type": file.type },
        });

        return response.status === 200;
    } catch (error) {
        console.error("Error uploading file:", error);
        return false;
    }
};
