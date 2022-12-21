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
                if(JSON.parse(body).length > 0){
                    let product;
                    await model.find(...JSON.parse(body)).then(result => product = result)
                    if(product !== null){
                        res.end(JSON.stringify(product))
                    } else {
                        res.statusCode = 404
                        res.end(JSON.stringify({message: 'product not found'}))
                    }
                } else {
                    res.statusCode = 404
                    res.end(JSON.stringify({message: 'product not found'}))
                }
            }
        }
    }
}