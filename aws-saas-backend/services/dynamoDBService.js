const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const createUser = async (user) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: user,
    };
    await docClient.send(new PutCommand(params));
};

const getUser = async (userId) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: { userId },
    };
    const result = await docClient.send(new GetCommand(params));
    return result.Item;
};

module.exports = { createUser, getUser };
