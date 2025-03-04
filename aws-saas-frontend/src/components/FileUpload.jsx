import { useState, useEffect } from "react";
import fetchWithAuth from "../api";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
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

        try {
            // Step 1: Request presigned URL from the backend
            const response = await fetchWithAuth("/s3/upload", "POST", {
                fileName: file.name,
                fileType: file.type,
            });

            const { uploadURL, fileName } = response;

            // Step 2: Upload file to S3 using presigned URL
            const s3Response = await fetch(uploadURL, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (!s3Response.ok) throw new Error("S3 Upload Failed");

            alert("File uploaded successfully!");
            fetchFiles(); // Refresh file list
        } catch (error) {
            console.error("Upload error:", error);
            alert("File upload failed!");
        }
    };

    const fetchFiles = async () => {
        try {
            const result = await fetchWithAuth("/s3/list"); // Fetch files from backend
	    console.log("Files received from backend:", result); // Debugging log
            setFiles(result);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleDelete = async (fileKey) => {
        try {
            //await fetchWithAuth(`/s3/delete/${fileKey}`, "DELETE");
	    await fetchWithAuth(`/s3/delete/${encodeURIComponent(fileKey)}`, "DELETE"); // Encode fileName to handle special characters
            setFiles((prevFiles) => prevFiles.filter(file => file.key !== fileKey));
            alert("File deleted successfully!");
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Failed to delete file!");
        }
    };

	/*
    const handleDelete = async (fileKey) => {
        try {
            await fetchWithAuth(`/s3/delete`, "DELETE", { fileName: fileKey }); // Send as body
            setFiles((prevFiles) => prevFiles.filter(file => file.fileName !== fileKey));
            alert("File deleted successfully!");
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Failed to delete file!");
        }
    };
    */

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

            {fileUrl && (
                <div className="mt-4">
                    <p>File URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        {fileUrl}
                    </a>
                </div>
            )}

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
