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
                    const product = [];
                    for (let index = 0; index < body.length; index++) {
                        const element = body[index];
                        await model.findById(element)
                        .then(result => product.push(result))
                    }
                    res.end(JSON.stringify(product))
                } else {
                    res.statusCode = 404
                    res.end(JSON.stringify({message: 'not found'}))
                }
            }
        }
    },
    updateOne(path, model){
        return {
            method: 'put',
            path: '/' + path,
            arrow: async (req, res) => {
                let body = ''
                await req.on('data', chunk => {
                    body += chunk
                })
                body = JSON.parse(body)
                let upt;
                await model.updateOne({_id: body.id}, body.arr)
                .then(result => upt = result)
                if(upt.acknowledged){
                    res.end(JSON.stringify({
                        message: 'User succesfully updated'
                    }))
                } else {
                    res.statusCode = 403
                    res.end(JSON.stringify({
                        message: 'User update failed'
                    }))
                }
            }
        }
    }
}