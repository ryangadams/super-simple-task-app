const crypto = require('node:crypto');

const items = [
    {id: 1, title: 'Remember the milk'}
];

function response(responseObject, status=200) {
    return {
        statusCode: status,
        body: JSON.stringify(responseObject),
    }
}

function createTask(requestBody) {
    const object = JSON.parse(requestBody);
    if (!object.title) {
        throw new Error('No Title found in request')
    }
    const newItem = {id: crypto.randomUUID(), title: object.title};
    items.push(newItem);
    return newItem;
}

function getItem(id) {
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

exports.handler = async (event) => {
    const [nameSpace, id, ...extras] = event.rawPath.toLowerCase().split("/").filter(segment => segment);
    if (nameSpace !== "tasks") {
        return response({error:`Unsupported namespace ${nameSpace}`
    }, 500);
    }
    if (id === undefined) {
        switch (event.requestContext.http.method) {
            case "POST":
                return response(createTask(event.body));
            case "GET":
                return response(getAllTasks());
        }
    }
    if (items.find(task => task.id === id) !== undefined) {
        switch (event.requestContext.http.method) {
            case "POST":
                return response(updateTask(id, event.body));
            case "GET":
                return response(getItem(id));
        }
    }
    return response({error:"not-found"}, 404);
};
