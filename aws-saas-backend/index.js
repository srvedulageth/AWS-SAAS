require("dotenv").config();  // Load environment variables

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const app = express();

app.use(cors());
app.use(express.json());

// Use routes
app.use("/api", routes);
//app.get("/", (req, res) => {
//    res.send("AWS SaaS API is running...");
//});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
