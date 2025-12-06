import serverInfo from "../config/server.json"
import apiInfo from "../config/api.json"

type ApiEndpoints = keyof typeof apiInfo;
type EndpointNames<T extends ApiEndpoints> = keyof typeof apiInfo[T];

export const apiKits = {
    buildUrl<T extends ApiEndpoints>(api: T, name: EndpointNames<T>) {
        return `http://${serverInfo.ip}:${serverInfo.port}/api/${apiInfo[api][name]}`
    },

    async emptyGet<T extends ApiEndpoints>(api: T, name: EndpointNames<T>) {
        return await this.get(api, name, null)
    },

    async get<T extends ApiEndpoints>(api: T, name: EndpointNames<T>, data: any) {
        let args = ''

        if (data != null) {
            args = '?'
            Object.keys(data).forEach(key => {
                args += `${key}=${data[key]}&`
            })
        }
        const response = await (await fetch(this.buildUrl(api, name) + args)).json()

        if (response["message"] === "Success") {
            return response["data"]
        }
        throw response["message"]
    },

    async post<T extends ApiEndpoints>(api: T, name: EndpointNames<T>, data: any) {
        const response = await fetch(this.buildUrl(api, name), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return await response.json()
    }
}
