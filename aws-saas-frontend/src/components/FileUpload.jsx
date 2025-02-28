import { useState } from "react";
import { Amplify } from "aws-amplify";
import { uploadData, getUrl } from "aws-amplify/storage";
import awsExports from "../aws-exports";

    console.log("Amplify Storage Config:", awsExports.Storage);
    Amplify.configure(awsExports);

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
	    console.log("File name (key):", fileName);
            console.log("File object:", file);

            const result = await uploadData(fileName, file, {
		    contentType: file.type,
		    accessLevel: "public"
	    });


	    console.log("Upload result:", result); // Log result object

            if (result?.key) {
		    console.log("Successful");
                const url = await getUrl({ key: result.key });
                setFileUrl(url.url); // Extract the actual URL
                alert("File uploaded successfully!");
            }
	    else {
                console.log("Upload error:", result);
                alert("File upload has issues!");
	    }
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
