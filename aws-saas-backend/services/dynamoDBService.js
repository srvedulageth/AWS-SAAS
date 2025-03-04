const AWS = require("aws-sdk");

AWS.config.update({
    region: process.env.AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
console.log("DynamoDB Table Name:", TABLE_NAME);
if (!TABLE_NAME) {
    throw new Error("DYNAMODB_TABLE_NAME is not set in environment variables");
}

// Get all items from DynamoDB
exports.getItems = async (req, res) => {
    try {
        const params = {
            TableName: TABLE_NAME,
        };

        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        console.error("DynamoDB Get Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Add an item to DynamoDB
exports.addItem = async (req, res) => {
    try {
        const { id, name, description } = req.body;

        if (!id || !name) {
            return res.status(400).json({ error: "Missing required fields: id, name" });
        }

        const params = {
            TableName: TABLE_NAME,
            Item: {
                id,
                name,
                description: description || "", // Optional field
            },
        };

        await dynamoDB.put(params).promise();
        res.json({ message: "Item added successfully!" });
    } catch (error) {
        console.error("DynamoDB Put Error:", error);
        res.status(500).json({ error: error.message });
    }
};
