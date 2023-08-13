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
                } catch (e) {
                    console.log(e);
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
                for (let index = 0; index < body.arr.length; index++) {
                    const element = body.arr[index];
                    await model.findById(element).then(res => result.push(res))
                }
                if(body.only){
                    function removeDuplicates(arr){

                        const result = []
                        const duplicatesIndices = []
        
                        arr.forEach((current, index) => {
        
                            if(duplicatesIndices.includes(index)) return
        
                            result.push(current)
        
                            for(let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++){
        
                                const comparison = arr[comparisonIndex]
                                const currentKeys = Object.keys(current.specification)
                                const comparisonKeys = Object.keys(comparison.specification)
        
                                if(currentKeys.length !== comparisonKeys.length) continue
        
                                const currentKeysString = currentKeys.sort().join("").toLowerCase()
                                const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase()
        
                                if(currentKeysString !== comparisonKeysString) continue
        
                                const comparison1 = arr[comparisonIndex]
        
                                let valuesEqual = true
                                for(let i = 0; i < currentKeys.length; i++){
                                    const key = currentKeys[i]
                                    if(
                                        current.price !== comparison1.price ||
                                        current.productName !== comparison1.productName){
                                        valuesEqual = false
                                        break
                                    }
                                }
        
                                if(valuesEqual) duplicatesIndices.push(comparisonIndex)
        
                            }
                        })
                        return result
                    }
                    result = removeDuplicates(result)
                }
                if(result){
                    res.end(JSON.stringify(result))
                } else {
                    res.statusCode = 404
                    res.end(JSON.stringify({message: 'not found'}))
                }
            }
        }
    },
    getDWP(path, model){
        return {
          method: "post",
          path: "/" + path,
          arrow: async (req, res) => {
            let body = "";
            await req.on("data", (chunk) => {
              body += chunk;
            });
            body = JSON.parse(body);
            let data = await model.find({});
            res.end(
              JSON.stringify({
                data: data.slice(
                  (body.page - 1) * body.perPage,
                  body.page * body.perPage
                ),
                allength: Math.ceil(data.length / body.perPage),
              })
            );
          },
        }
    }
}