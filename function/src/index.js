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
    if (api.isValidTaskId(id)) {
        switch (event.requestContext.http.method) {
            case "PATCH":
                return response(api.updateTask(id, event.body));
            case "POST":
            case "PUT":
                return response(api.replaceTask(id, event.body));
            case "DELETE":
                return response(api.deleteTask(id));
            case "GET":
                return response(api.getTask(id));
        }
    }
    return response({error: "not-found"}, 404);
};
