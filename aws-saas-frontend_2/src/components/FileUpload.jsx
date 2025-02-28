import { useState } from "react";
import { Amplify } from "aws-amplify";
{/*import {Auth} from "aws-amplify";
import { Storage } from "aws-amplify"; */}

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

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
            const fileName = `uploads/${Date.now()}-${file.name}`;
            await Storage.put(fileName, file, {
                contentType: file.type,
                acl: "public-read",
            });

            const url = await Storage.get(fileName);
            setFileUrl(url);
            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("File upload failed!");
        } finally {
            setUploading(false);
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
