const crypto = require("node:crypto");

const items = [
    {id: "1", title: 'Remember the milk'}
];

function createTask(requestBody) {
    const object = JSON.parse(requestBody);
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

function getAllTasks() {
    return items;
}

function updateTask(id, newValues) {
    const indexToChange = items.findIndex(task => task.id === id);
    const itemToChange = items[indexToChange];
    const newItem = {
        ...itemToChange,
        ...JSON.parse(newValues)
    };
    items.splice(indexToChange, 1, newItem)
    return newItem;
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

exports.updateTask = updateTask;
exports.replaceTask = replaceTask;
exports.createTask = createTask;
exports.getTask = getTask;
exports.getAllTasks = getAllTasks;
exports.isValidTaskId = isValidTaskId;
exports.deleteTask = deleteTask;
