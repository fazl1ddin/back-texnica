module.exports = {
    getAny(path, model){
        return {
            method: 'get',
            path: '/' + path,
            arrow: async (req, res) => {
                let body = new Array
                await model.find().then(result => body = result)
                res.end(JSON.stringify(body))
            }
        }
    },
    addAny(path, model){
        return {
            method: 'post',
            path: '/' + path,
            arrow: async (req, res) => {
                try{
                    let body = new String
                    await req.on('data', chunk => {
                        body += chunk
                    })
                    await model.create(JSON.parse(body))
                    res.end(JSON.stringify(true))
                } catch(e){
                    res.end(JSON.stringify(false))
                }
            }
        }
    },
    getOne(path, model){
        return {
            method: 'post',
            path: '/' + path,
            arrow: async (req, res) => {
                let body = ''
                await req.on('data', chunk => {
                    body += chunk
                })
                body = JSON.parse(body)
                if(body.length > 0){
                    let product = [];
                    await body.forEach(async (element, index) => {
                        await model.findById(element)
                        .then(result => product.push(result))
                    })
                    console.log(product);
                    res.end(JSON.stringify(product))
                } else {
                    res.statusCode = 404
                    res.end(JSON.stringify({message: 'products not found'}))
                }
            }
        }
    }
}