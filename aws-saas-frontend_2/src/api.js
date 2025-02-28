import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const fetchUserData = async () => {
    try {
        const response = await API.get("/protected");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};
