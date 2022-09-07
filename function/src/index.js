import api from "./api.js";

function response(responseObject, status = 200) {
    return {
        statusCode: status,
        body: JSON.stringify(responseObject),
    }
}

export const handler = async (event) => {
    // /tasks/one
    const [nameSpace, id, ...extras] = event.rawPath.toLowerCase().split("/").filter(segment => segment);
    if (nameSpace !== "tasks") {
        return response({
            error: `Unsupported namespace ${nameSpace}`
        }, 500);
    }
    if (id === undefined) {
        switch (event.requestContext.http.method) {
            case "POST":
                const newTask = JSON.parse(event.body);
                return response(api.createTask(newTask));
            case "GET":
                return response(await api.getAllTasks());
        }
    }
    switch (event.requestContext.http.method) {
        case "PATCH":
            const updateData = JSON.parse(event.body);
            return response(await api.updateTask(id, updateData));
        case "POST":
        case "PUT":
            const newData = JSON.parse(event.body);
            return response(await api.replaceTask(id, newData));
        case "DELETE":
            return response(await api.deleteTask(id));
        case "GET":
            return response(await api.getTask(id));
    }
    return response({error: "not-found"}, 404);
};
