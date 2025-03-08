import axios from "axios";

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
