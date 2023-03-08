const { Users, Products, News, Promos } = require('../store/models.cjs')
const fns = require('../app/manyFunctions.cjs')
const images = require('../img/index.cjs')
const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
config()

module.exports = [
    fns.getAny('users', Users),
    fns.getAny('products', Products),
    fns.getAny('news', News),
    fns.getAny('promos', Promos),
    fns.addAny('add-user', Users),
    fns.addAny('add-product', Products),
    fns.addAny('add-new', News),
    fns.addAny('add-promo', Promos),
    fns.getOne('product', Products),
    fns.updateOne('update-user', Users),
    {
        method: 'post',
        path: '/login',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            const {obj, logType, token} = JSON.parse(body)
            let user;
            if(logType === 'pass'){
                const phone = parseInt(obj.iden.replace('+', ''))
                if(!isNaN(phone)){
                    await Users.findOne({phone: phone, password: obj.password}).then(result => user = result)
                } else {
                    await Users.findOne({mail: obj.iden, password: obj.password}).then(result => user = result)
                }
                if(user != null){
                    const id = user._id.toString()
                    const token = jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: '1d'})
                    res.end(JSON.stringify({token: token, user}))
                } else {
                    res.statusCode = 401
                    res.end(JSON.stringify({message: 'Polzovatel ne naydyon'}))
                }                
            } else {
                try {
                    if(jwt.verify(token, process.env.SECRET_KEY, {expiresIn: '1d'})){
                        await Users.findOne({id: jwt.decode(token, {expiresIn: '1d'})}).then(result => user = result)
                        res.end(JSON.stringify({user}))
                    }
                } catch(e){
                    if(e.expiredAt){
                        res.statusCode = 401
                        res.end(JSON.stringify({
                            message: 'token expired',
                            date: e.expiredAt.toString()
                        }))
                    } else {
                        res.statusCode = 500
                        res.end('nepredvidennaya oshibka')
                    }
                }
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
    {
        method: 'post',
        path: '/check-module',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            body = JSON.parse(body)
            let resl;
            await Users.findById(body.user_id)
            .then(result => resl = result)
            const arr = []
            for (let index = 0; index < body.arr.length; index++) {
                const element = body.arr[index];
                if(resl[body.module].some((item, index) => item.id == element)) arr.push(element)
            }
            res.end(JSON.stringify(arr))
        }
    },
    ...images,
]