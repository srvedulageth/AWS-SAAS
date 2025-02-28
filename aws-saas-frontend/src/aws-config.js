import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

// Debugging logs
console.log("Final awsExports Object:", JSON.stringify(awsExports, null, 2));

try {
    Amplify.configure(awsExports);
    console.log("✅ Amplify Successfully Configured!");
} catch (error) {
    console.error("❌ Error configuring Amplify:", error);
}

export default Amplify;
