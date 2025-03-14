import { fetchAuthSession } from "aws-amplify/auth";

//const API_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = "https://zd9b7so052.execute-api.us-west-1.amazonaws.com/mysaasapistage-1"; // API Gateway URL

const fetchWithAuth = async (endpoint, method = "GET", body = null) => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken;

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (!(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const options = {
            method,
            headers,
        };

        if (body) {
            options.body = body instanceof FormData ? body : JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "API Request Failed");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export default fetchWithAuth;
