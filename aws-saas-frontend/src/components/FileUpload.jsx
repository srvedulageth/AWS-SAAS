import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { uploadData, getUrl, list, remove } from "aws-amplify/storage";
import awsExports from "../aws-exports";

// Configure Amplify with your aws-exports
Amplify.configure(awsExports);

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

        setUploading(true);
        try {
            // Generate a unique file name to avoid conflicts
            const fileName = `uploads/${Date.now()}-${file.name}`;
            console.log("File name (key):", fileName);
            console.log("File object:", file);

            // Prepare the operation
            const operation = uploadData({
                path: fileName,  // Key (path) where the file will be uploaded in S3
                data: file,      // The file object to be uploaded
            });

            // Wait for the upload operation to complete
            fetchFiles(); // Refresh the file list
            const result = await operation.result;
            console.log("Upload result:", result);

            if (result?.path) {
                console.log("Upload successful");

                // Get the URL of the uploaded file
                const urlResult = await getUrl({ key: result.path });
                console.log("URL", urlResult);
                console.log("URL", urlResult.url.href);
                setFileUrl(urlResult.url.origin); // Extract and set only the URL string

                alert("File uploaded successfully!");
            } else {
                console.log("Upload error: result is missing the path", result);
                alert("File upload has issues!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("File upload failed!");
        } finally {
            setUploading(false);
        }
    };


    const fetchFiles = async () => {
        try {
            const result = await list({
                path: "uploads/", // The prefix to list files under
                options: {
                    accessLevel: "public", // Specify the access level
                }
            });

            console.log("File list result:", result);
            setFiles(result.items); // Set the list of files
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };


    const handleDelete = async (fileKey) => {
        try {
            await remove({ path: fileKey }); // Use `path` instead of directly passing key

            // Update state to remove the deleted file from the list
            setFiles((prevFiles) => prevFiles.filter(file => file.path !== fileKey));

            alert("File deleted successfully!");
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

            {fileUrl && (
                <div className="mt-4">
                    <p>File URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        {fileUrl}
                    </a>
                </div>
            )}

        </div>
    );
};

export default FileUpload;
