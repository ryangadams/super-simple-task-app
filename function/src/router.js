import {response} from "./util.js";

export const match = (event) => {
    return {
        response: null,
        pathParameters: {},
        routes: [],
        route: function (routes) {
            for (const [method, path, action] of routes) {
                this.add(method, path, action);
            }
        },
        add: function (method, path, action) {
            this.routes.push({method, path, action})
        },
        exec: async function () {
            for (const {method, path, action} of this.routes) {
                const response = await this.match(method, path, action);
                console.log("DEBUG", method, path, response);
                if (response !== null) {
                    return response;
                }
            }
            return response({error: "not-found"}, 404)
        },
        match: async function (method, path, action) {
            const segments = path.split("/");
            const rawSegments = event.rawPath.split("/");
            let isPathMatch = true;
            if (segments.length !== rawSegments.length) {
                return null;
            }
            segments.forEach((name, index) => {
                if (name.startsWith(":")) {
                    this.pathParameters[name.slice(1)] = rawSegments[index];
                } else if (name !== rawSegments[index]) {
                    isPathMatch = false;
                }
            });
            if (event.requestContext.http.method === method && isPathMatch) {
                return await action(this.pathParameters);
            }
            return null;
        }
    }
}
