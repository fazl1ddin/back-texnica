const { Users, Products, News, Promos, Customs } = require('../store/models.cjs')
const fns = require('../app/manyFunctions.cjs')
const images = require('../img/index.cjs')
const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
config()

function removeDuplicates(arr, key){

    const result = []
    const duplicatesIndices = []

    arr.forEach((current, index) => {

        if(duplicatesIndices.includes(index)) return

        result.push(current.specification[key])

        for(let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++){

            const comparison = arr[comparisonIndex]

            let valuesEqual = true
            if(current.specification[key] !== comparison.specification[key]){
                valuesEqual = false
                break
            }

            if(valuesEqual) duplicatesIndices.push(comparisonIndex)

        }
    })
    return result
}

module.exports = [
    fns.getAny('users', Users),
    // fns.getAny('products', Products),
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
    {
        method: 'post',
        path: '/add-comment',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            body = JSON.parse(body)
            let oldProduct = await Products.findById(body.productId)
            let sum = oldProduct.comments.reduce((p, n) => p + n.rate,0)
            let product = await Products.findByIdAndUpdate(body.productId, {
                rates: oldProduct.comments.length ? Math.round((sum + Number(body.rate)) / (oldProduct.comments.length + 1)) : body.rate,
                comments: [
                    ...oldProduct.comments,
                    {
                        userId: body.userId,
                        rate: body.rate,
                        date: Date.now(),
                        title: body.title,
                        content: body.content
                    }
                ]
            }, {new: true})
            res.end(JSON.stringify(product))
        }
    },
    {
        method: 'post',
        path: '/get-user-data',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            body = JSON.parse(body)
            let arr = []
            for (let index = 0; index < body.userId.length; index++) {
                const element = body.userId[index];
                let result = {}
                let user = await Users.findById(element)
                for (let index = 0; index < body.keys.length; index++) {
                    const element = body.keys[index];
                    if(element !== 'password'){
                        result[element] = user[element]
                    }
                }
                arr[index] = result
            }
            res.end(JSON.stringify(arr))
        }
    },
    {
        method: 'get',
        path: '/get-index-promos',
        arrow: async (req, res) => {
            let result = await Customs.find({}).then(res => res[0]?.indexPromos)
            if (result !== null) {
                res.end(JSON.stringify(result))
            } else {
                res.end('indexPromos hali berilmagan')
            }
        }
    },
    {
        method: 'post',
        path: '/products',
        arrow: async (req, res) => {
            let body = ''
            await req.on('data', chunk => {
                body += chunk
            })
            body = JSON.parse(body)
            let products = await Products.find()
            let sorted = [...products].sort((a, b) => a.price - b.price)
            let filtersChecks = {
                price: {
                    min: sorted[0].price,
                    max: sorted[sorted.length - 1].price
                },
                podsvetka: removeDuplicates(products, 'cruise'),
                moshnost: removeDuplicates(products, 'power'),
                maksSpeed: removeDuplicates(products, 'speed')
            }
            res.end(JSON.stringify({
                products,
                filtersChecks
            }))
        }
    },
    ...images,
]