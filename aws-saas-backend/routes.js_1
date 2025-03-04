const authenticateUser = require("./middlewares/authMiddleware");

app.get("/protected", authenticateUser, (req, res) => {
    res.json({ message: `Welcome, ${req.user.email}` });
});

const { createUser } = require("./services/dynamoDBService");
const { v4: uuidv4 } = require("uuid");

app.post("/register", async (req, res) => {
    try {
        const { email, name } = req.body;
        const user = {
            userId: uuidv4(),
            email,
            name,
            createdAt: new Date().toISOString(),
        };
        await createUser(user);
        res.json({ message: "User registered", user });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

const upload = require("./services/s3Service");

app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ message: "File uploaded", url: req.file.location });
});
