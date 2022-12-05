const { Users, Products, News, Promos } = require('../store/models.cjs')
const fns = require('../app/manyFunctions.cjs')
const images = require('../img/index.cjs')

module.exports = [
    fns.getAny('users', Users),
    fns.getAny('products', Products),
    fns.getAny('news', News),
    fns.getAny('promos', Promos),
    fns.addAny('add-user', Users),
    fns.addAny('add-product', Products),
    fns.addAny('add-new', News),
    fns.addAny('add-promo', Promos),
    {
        method: 'post',
        path: '/login',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            const obj = JSON.parse(body)
            let user;
            if(obj.logType === 'pass'){
                const phone = parseInt(obj.iden.replace('+', ''))
                if(!isNaN(phone)){
                    await Users.find({phone: phone, password: obj.password}).then(result => user = result)
                } else {
                    await Users.find({mail: obj.iden, password: obj.password}).then(result => user = result)
                }
                res.end(JSON.stringify({token, user}))
            } else {

            }
        }
    },
    {
        method: 'post',
        path: '/sing-up',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            const obj = JSON.parse(body)
            Users.create({...obj, 
                favorites: [],
                cart: [],
                viewed: [],
                compare: [],})
            res.end('true')
        }
    },
    ...images,
]