const { Users, Products, News, Promos, Customs } = require('../store/models.cjs')
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
    fns.getOne('product', Products),
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
        method: 'put',
        path: '/update-user',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            body = JSON.parse(body)
            let upt;
            let data;
            await Users.findOne({_id: body.id}).then(result => data = result)
            let arr = []
            if(body.method === 'add'){
                arr = [...data[body.module], body.data]
            } else if(body.method === 'remove'){
                arr = data[body.module].filter((item) => item.id !== body.data.id)
            }
            await Users.findOneAndUpdate({_id: body.id}, {[body.module]: arr}, {new: true})
            .then(result => upt = result)
            if(data[body.module].length !== upt[body.module].length){
                res.end(JSON.stringify({
                    message: 'User succesfully updated',
                    user: upt
                }))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({
                    message: 'User update failed'
                }))
            }
        }
    },
    {
        method: 'get',
        path: '/index-products',
        arrow: async (req, res) => {
            res.setHeader('content-type', 'application/json; charset=utf-8')
            let result = await Customs.find({}).then(res => res[0]?.indexP)
            if (result !== null) {
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    let arr = []
                    for (let i = 0; i < element.every.length; i++) {
                        const item = element.every[i];
                        await Products.findById(item).then(result => arr[i] = result)
                    }
                    arr = arr.map((item, index) => ({
                            ...item,
                            space: new Intl.NumberFormat('ru').format(item.price * item.sale / 100),
                            realPrice: new Intl.NumberFormat('ru').format(item.price - (item.price * item.sale / 100)),
                        })
                    )
                    // console.log(arr, 'arrrrrrrrr');
                    console.log(arr);
                    result[index] = {
                        title: element.title,
                        href: element.href,
                        every: arr
                    }
                }
                res.end(JSON.stringify(result))
            } else {
                res.end('indexP hali berilmagan')
            }
        }
    },
    {
        method: 'get',
        path: '/get-rec',
        arrow: async (req, res) => {
            let result = await Customs.find({}).then(res => res[0]?.recs)
            if (result !== null) {
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    await Products.findById(element).then(res => result[index] = res)
                }
                res.end(JSON.stringify(result))
            } else {
                res.end('recs hali berilmagan')
            }
        }
    },
    ...images,
]