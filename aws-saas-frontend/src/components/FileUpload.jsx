import { useState, useEffect } from "react";
import { getPresignedUrl, uploadFileToS3 } from "../s3Service/s3Service"; // Import services
import fetchWithAuth from "../api"; // Keep for list and delete functions

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        setUploading(true);

        try {
            // Step 1: Request pre-signed URL
            const uploadURL = await getPresignedUrl(file);
            if (!uploadURL) throw new Error("Could not get upload URL");

            // Step 2: Upload file to S3
            const success = await uploadFileToS3(file, uploadURL);
            if (!success) throw new Error("S3 Upload Failed");

            alert("File uploaded successfully!");
            fetchFiles(); // Refresh file list
        } catch (error) {
            console.error("Upload error:", error);
            alert("File upload failed!");
        } finally {
            setUploading(false);
        }
    };

/*
    const fetchFiles = async () => {
        try {
            const result = await fetchWithAuth("/s3/list"); // Fetch files from backend
	    console.log("Files received from backend:", result); // Debugging log
            setFiles(result);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const fetchFiles = async () => {
        try {
            const response = await fetch("https://zd9b7so052.execute-api.us-west-1.amazonaws.com/mysaasapistage-1/s3");
            if (!response.ok) throw new Error("Failed to fetch files");
            const result = await response.json();
            console.log("Files received:", result);
            setFiles(result);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };
*/

    const fetchFiles = async () => {
        try {
            const response = await fetch("https://zd9b7so052.execute-api.us-west-1.amazonaws.com/mysaasapistage-1/s3", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Origin": "http://52.53.157.10:5173", // 🔹 Ensures correct origin
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Files received from API Gateway:", result);
            setFiles(result);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };


	/*
    const handleDelete = async (fileKey) => {
        try {
	    await fetchWithAuth(`/s3/${encodeURIComponent(fileKey)}`, "DELETE"); // Encode fileName to handle special characters
            setFiles((prevFiles) => prevFiles.filter(file => file.fileName !== fileKey));
            alert("File deleted successfully!");
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Failed to delete file!");
        }
    };

    const handleDelete = async (fileKey) => {
        try {
            // Use the correct path /s3/{fileKey} to delete the file
            const response = await fetchWithAuth(`/s3/${encodeURIComponent(fileKey)}`, {
            method: "DELETE",
            });

            // If the response is not successful, throw an error
            if (!response.ok) {
                throw new Error("Failed to delete file");
            }

            // Remove the deleted file from the list
            setFiles((prevFiles) => prevFiles.filter(file => file.fileName !== fileKey));

            alert("File deleted successfully!");
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Failed to delete file!");
        }
    };
    */

    const handleDelete = async (fileKey) => {
        try {
            // Ensure the URL is correctly formatted
            const url = `/s3/${encodeURIComponent(fileKey)}`;

            // Correctly pass method and headers to fetchWithAuth
            const response = await fetchWithAuth(url, "DELETE");
	    console.log("handleDelete:", response);

	    if (response.message && response.message.includes('deleted successfully')) {
               // Successfully deleted, update state
               //setFiles((prevFiles) => prevFiles.filter(file => file.key !== fileKey));
               alert("File deleted successfully!");
               fetchFiles(); // Refresh file list
           } else {
               throw new Error("File deletion failed");
           }
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Failed to delete file!");
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button 
                className="bg-blue-500 text-white p-2 rounded" 
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            <div className="mt-4">
                <h3>Uploaded Files:</h3>
                <ul>
                    {files.map((file) => (
                        <li key={file.fileName} className="flex justify-between w-80">
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                {file.fileName}
                            </a>
                            <button 
                                className="bg-red-500 text-white px-2 rounded"
                                onClick={() => handleDelete(file.fileName)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FileUpload;
