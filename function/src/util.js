export function response(responseObject, status = 200) {
    return {
        statusCode: status,
        body: JSON.stringify(responseObject),
    }
}
