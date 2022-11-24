module.exports = class Router{
    constructor(){
        this.endpoints = {}
    }

    request(method = 'GET', path, handler){
        if(!this.endpoints[path]){
            this.endpoints[path] = {}
        }

        const endpoint = this.endpoints[path]
        if(endpoint[method]) {

            console.log(endpoint);
            throw new Error(`${method} was on path ${path}`)
        }

        endpoint[method] = handler
    }

    get(path, handler){
        this.request('GET', path, handler)
    }

    post(path, handler){
        this.request('POST', path, handler)
    }

    pul(path, handler){
        this.request('PUL', path, handler)
    }

    delete(path, handler){
        this.request('DELETE', path, handler)
    }
}