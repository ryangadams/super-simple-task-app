import api from "./api.js";
import {response} from "./util.js";
import {match} from "./router.js";


export const handler = async (event) => {
    const route = match(event);
    route.route([
        ["GET", "/tasks", async () => {
            return response(await api.getAllTasks());
        }],
        ["POST", "/tasks", async () => {
            const newTask = JSON.parse(event.body);
            return response(await api.createTask(newTask));
        }],
        ["GET", "/tasks/:id", async ({id}) => {
            return response(await api.getTask(id));
        }],
        ["DELETE", "/tasks/:id", async ({id}) => {
            return response(await api.deleteTask(id));
        }],
        ["PATCH", "/tasks/:id", async ({id}) => {
            const updateData = JSON.parse(event.body);
            return response(await api.updateTask(id, updateData));
        }],
        ["PUT", "/tasks/:id", async ({id}) => {
            const updateData = JSON.parse(event.body);
            return response(await api.replaceTask(id, updateData));
        }],
        ["POST", "/tasks/:id", async ({id}) => {
            const updateData = JSON.parse(event.body);
            return response(await api.replaceTask(id, updateData));
        }]
    ]);
    return await route.exec();
};
