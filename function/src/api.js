import crypto from "node:crypto";
import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
// const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

// Set the AWS Region.
const REGION = "eu-west-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: REGION });



const items = [
    {id: "1", title: 'Remember the milk'}
];

function createTask(object) {

    if (!object.title) {
        throw new Error('No Title found in request')
    }
    const newItem = {id: crypto.randomUUID(), title: object.title};
    items.push(newItem);
    return newItem;
}

function getTask(id) {
    return items.find(task => task.id === id);
}

async function getAllTasks() {
    const params = {
        TableName: "InstilTrainingRyansTasks",
    };
    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items.map(dbItem => {
        // a no good ugly transform
        return Object.fromEntries(
            Object.entries(dbItem).map(([key, value]) => [key, Object.values(value)[0]]));
    });
}

function updateTask(id, newValues) {
    const indexToChange = items.findIndex(task => task.id === id);
    const taskToChange = items[indexToChange];
    const newTask = {
        ...taskToChange,
        ...JSON.parse(newValues)
    };
    items.splice(indexToChange, 1, newTask)
    return newTask;
}

function replaceTask(id, newTask) {
    const indexToChange = items.findIndex(task => task.id === id);
    const itemToChange = {
        ...(JSON.parse(newTask)),
        id: id
    }
    items.splice(indexToChange, 1, itemToChange)
    return itemToChange;
}

function deleteTask(id) {
    const indexToRemove = items.findIndex(task => task.id === id);
    return items.splice(indexToRemove, 1)[0];
}

function isValidTaskId(id) {
    return items.find(task => task.id === id.toString()) !== undefined;
}

export default {
    updateTask: updateTask,
    replaceTask: replaceTask,
    createTask: createTask,
    getTask: getTask,
    getAllTasks: getAllTasks,
    isValidTaskId: isValidTaskId,
    deleteTask: deleteTask,
}
