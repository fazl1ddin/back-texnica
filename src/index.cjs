const routes = require('./router/routes.cjs')
const { connect } = require('./store/index.cjs')

const App = require('./app/index.cjs')
const Router = require('./router/index.cjs')
const app = new App()

const router = new Router()

connect().then(() => {
    routes.filter(item => Boolean(item)).forEach(element => {
        router[element.method](element.path, element.arrow)
    });

    app.addRouter(router)

    app.listen()
}).catch(e => {
    console.error(e);
})

