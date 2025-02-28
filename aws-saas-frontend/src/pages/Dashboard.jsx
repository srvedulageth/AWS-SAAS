{/*
import { useEffect, useState } from "react";
import { fetchUserData } from "../api";

const Dashboard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchUserData().then(data => setUserData(data));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            {userData ? (
                <pre className="bg-gray-200 p-4 rounded">{JSON.stringify(userData, null, 2)}</pre>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};
*/}

import FileUpload from "../components/FileUpload";

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            <FileUpload />
        </div>
    );
};

export default Dashboard;
