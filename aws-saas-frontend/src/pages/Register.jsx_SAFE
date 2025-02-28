import { useState } from "react";
import { Amplify } from "aws-amplify";
import { signUp } from "aws-amplify/auth";
import "../aws-config";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister = async () => {
        try {
            await signUp({
                username: email,
                password,
                attributes: { email, name },
            });
            alert("Registration successful! Check your email for a verification link.");
        } catch (error) {
            alert("Error registering: " + error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">Register</h2>
            <input type="text" placeholder="Name" className="border p-2 mb-2" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" className="border p-2 mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="border p-2 mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-green-500 text-white p-2" onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
