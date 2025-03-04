const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const axios = require("axios");

const COGNITO_REGION = "us-west-1"; // Change to your region
const USER_POOL_ID = "us-west-1_mJ0nwfHd2"; // Change to your Cognito User Pool ID
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

let jwksCache = null; // Cache the JWKS response

const getPublicKey = async (kid) => {
    try {
        if (!jwksCache) {
            const response = await axios.get(JWKS_URL);
            jwksCache = response.data.keys;
        }

        const key = jwksCache.find((k) => k.kid === kid);
        if (!key) throw new Error("Public key not found in JWKS");

	    console.log("Key", key);
	    console.log("Key", jwkToPem(key));
        return jwkToPem(key);
    } catch (error) {
        throw new Error("Error fetching public key: " + error.message);
    }
};

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        // Decode token header to get the 'kid' (key ID)
        const decodedHeader = jwt.decode(token, { complete: true });
        if (!decodedHeader || !decodedHeader.header.kid) {
            return res.status(401).json({ message: "Invalid token header" });
        }

        const pem = await getPublicKey(decodedHeader.header.kid);

	    console.log("Token: ", token);
        jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized: Token verification failed" });
            }

            req.user = decoded; // Attach user data to request
            next();
        });
    } catch (error) {
        return res.status(401).json({ message: "Auth failed: " + error.message });
    }
};

module.exports = authenticateUser;
