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
                let result = [];
                await model.findById(body)
                .then(result => result = result)
                if(result){
                    res.end(JSON.stringify(result))
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
                let data;
                await model.findOne({_id: body.id}).then(result => data = result)
                await model.findOneAndUpdate({_id: body.id}, {[body.module]: [...data[body.module], body.data]}, {new: true})
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
        }
    }
}