import crypto from "node:crypto";
import {
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    ScanCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";


// Set the AWS Region.
const REGION = "eu-west-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: REGION });

const defaultParams = {
    TableName: "InstilTrainingRyansTasks"
}

async function createTask(object) {
    if (!object.title) {
        throw new Error('No Title found in request')
    }
    const newItem = {id: crypto.randomUUID(), title: object.title};
    const params = {
        ...defaultParams,
        Item: marshall(newItem)
    }
    try {
        await ddbClient.send(new PutItemCommand(params));
        return newItem;
    } catch (e) {
        return {"error": e.message}
    }
}

async function getTask(id) {
    const params = {
        ...defaultParams,
        Key: marshall({id})
    }
    const {Item} = await ddbClient.send(new GetItemCommand(params));
    return unmarshall(Item);
}

async function getAllTasks() {
    const data = await ddbClient.send(new ScanCommand(defaultParams));
    return data.Items.map(dbItem => unmarshall(dbItem));
}

async function updateTask(id, newValues) {
    const keysToUpdate = Object.keys(newValues);
    const toUpdateExpression = (key, index) => `${key} = :${index}`;
    const toExpressionAttributeValue = (key, index) => [`:${index}`, marshall(newValues[key])];

    const updateParams = {
        ...defaultParams,
        Key: marshall({id}),
        UpdateExpression: "SET " + keysToUpdate.map(toUpdateExpression).join(", "),
        ExpressionAttributeValues: Object.fromEntries(keysToUpdate.map(toExpressionAttributeValue)),
        ReturnValues: 'ALL_NEW'
    }
    const {Attributes} = await ddbClient.send(new UpdateItemCommand(updateParams));
    return unmarshall(Attributes);
}

async function replaceTask(id, newTask) {
    const putParams = {
        ...defaultParams,
        Item: marshall({
            ...newTask,
            id: id
        })
    }
    await ddbClient.send(new PutItemCommand(putParams));
    return unmarshall(putParams.Item);
}

async function deleteTask(id) {
    const deleteParams = {
        ...defaultParams,
        Key: marshall({id}),
        ReturnValues: 'ALL_OLD'
    }
    const {Attributes} = await ddbClient.send(new DeleteItemCommand(deleteParams));
    return unmarshall(Attributes);
}

export default {
    updateTask: updateTask,
    replaceTask: replaceTask,
    createTask: createTask,
    getTask: getTask,
    getAllTasks: getAllTasks,
    deleteTask: deleteTask,
}
