const routes = require('./router/routes.cjs')

const App = require('./app/index.cjs')
const Router = require('./router/index.cjs')

const app = new App()

const router = new Router()

// routes.forEach(element => {
//     router[element.method](element.path, element.arrow)
// });

router.post('/add-user', (req, res) => {
    console.log(req);
    res.end(req.body)
})

app.addRouter(router)

app.listen()