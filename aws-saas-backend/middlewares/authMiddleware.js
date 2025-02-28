const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.decode(token);
        if (!decoded) return res.status(401).json({ message: "Invalid token" });

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Auth failed" });
    }
};

module.exports = authenticateUser;
