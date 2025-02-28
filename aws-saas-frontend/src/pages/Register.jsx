import { useState } from "react";
import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

import "../aws-config";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [requiresConfirmation, setRequiresConfirmation] = useState(false);

    const handleRegister = async () => {
        try {
            await signUp({
                username: email,
                password,
                attributes: { email, name },
            });
            alert("Registration successful! Check your email for a verification link.");
	    setRequiresConfirmation(true);
        } catch (error) {
            alert("Error registering: " + error.message);
        }
    };

    const handleConfirmSignUp = async () => {
        try {
            await confirmSignUp({
                username: email,
                confirmationCode: verificationCode,
            });
            alert("Verification successful! You can now log in.");
            setRequiresConfirmation(false);
        } catch (error) {
            alert("Error confirming sign-up: " + error.message);
        }
    };

    const handleResendVerificationCode = async () => {
        try {
            await resendSignUpCode({ username: email });
            alert("New verification code sent!");
        } catch (error) {
            alert("Error resending code: " + error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">{requiresConfirmation ? "Confirm Your Email" : "Register"}</h2>
            <input type="text" placeholder="Name" className="border p-2 mb-2" value={name} onChange={(e) => setName(e.target.value)} disabled={requiresConfirmation} />
            <input type="email" placeholder="Email" className="border p-2 mb-2" value={email} onChange={(e) => setEmail(e.target.value)} disabled={requiresConfirmation} />
            {!requiresConfirmation ? (
                <>
                    <input type="password" placeholder="Password" className="border p-2 mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="bg-green-500 text-white p-2" onClick={handleRegister}>Register</button>
                </>
            ) : (
                <>
                    <input type="text" placeholder="Enter verification code" className="border p-2 mb-2" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                    <button className="bg-blue-500 text-white p-2 mb-2" onClick={handleConfirmSignUp}>Confirm</button>
                    <button className="bg-yellow-500 text-white p-2" onClick={handleResendVerificationCode}>Resend Code</button>
                </>
            )}
        </div>
    );
};

export default Register;
