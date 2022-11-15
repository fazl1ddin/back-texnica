const http = require('http')
const events = require('events')

module.exports = class App{
    constructor(){
        this.event = new events
        this.server = this._createServer()
    }

    listen(){
        this.server.listen(process.env.PORT || 3000, process.env.HOSTNAME || 'localhost', () => {
            console.log('server started on Port');
        })
    }

    addRouter(router){
        Object.keys(router.endpoints).forEach(path => {
            const endpoint = router.endpoints[path]
            Object.keys(endpoint).forEach(method => {
                const handler = endpoint[method]
                this.event.on(this._getRouteMask(path, method), (req, res) => {
                    handler(req, res)
                })
            })
        })
    }

    _createServer(){
        return http.createServer((req, res) => {
            res.setHeader('Content-Type', 'application/json')
            const emitted = this.event.emit(this._getRouteMask(req.url, req.method), req, res)
            if(!emitted){
                res.end('page not found')
            }
        })
    }

    _getRouteMask(path, method){
        return `${path}:${method}`
    }
}