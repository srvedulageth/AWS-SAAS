import { useState } from "react";
import { Amplify } from "aws-amplify";
import { signIn } from "aws-amplify/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const user = await signIn(email, password);
            console.log('Signed in:', user);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">Login</h2>
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
        </div>
    );
};

export default Login;
