import { fetchAuthSession } from "aws-amplify/auth";

const API_INVOKE_URL = import.meta.env.VITE_API_BASE_URL; // API Gateway URL
console.log(API_INVOKE_URL);

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

        const response = await fetch(`${API_INVOKE_URL}${endpoint}`, options);
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
