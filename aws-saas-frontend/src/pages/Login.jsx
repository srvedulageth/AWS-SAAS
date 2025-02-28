import { useState, useEffect } from "react";
import { signIn, signOut, getCurrentUser } from "aws-amplify/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if a user is already authenticated on component mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await getCurrentUser();
                console.log("User already signed in:", user);
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkUser();
    }, []);

    const handleLogin = async () => {
        try {
            // Check if already signed in
            const user = await getCurrentUser();
            if (user) {
                console.log("Already signed in:", user);
                setIsAuthenticated(true);
                return;
            }
        } catch {
            // User is not signed in, proceed with login
        }

        try {
            const user = await signIn({
                username: email,
                password: password,
                options: { authFlowType: "USER_PASSWORD_AUTH" }
            });
            console.log("Signed in:", user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            console.log("Signed out successfully");
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">{isAuthenticated ? "Welcome!" : "Login"}</h2>
            {!isAuthenticated ? (
                <>
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 mb-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>
                        Login
                    </button>
                </>
            ) : (
                <button className="bg-red-500 text-white p-2" onClick={handleSignOut}>
                    Logout
                </button>
            )}
        </div>
    );
};

export default Login;

