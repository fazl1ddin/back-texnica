const { Users, Products } = require('../store/models.cjs')
const fs = require('fs')

module.exports = [
    {
        method: 'get',
        path: '/users',
        arrow: async (req, res) => {
          let body = new Array;
          await Users.find().then(result => body = result)
          res.end(JSON.stringify(body))
        }
    },
    {
        method: 'get',
        path: '/products',
        arrow: async (req, res) => {
          let body = new Array;
          await Products.find().then(result => body = result)
          res.end(JSON.stringify(body))
        }
    },
    {
        method: 'post',
        path: '/add-user',
        arrow: async (req, res) => {
          let body = new String;
          await req.on('data', (chunk) => {
            body += chunk
          })
          res.end(JSON.stringify({name: '323223'}))
        }
    },
    {
        method: 'post',
        path: '/add-product',
        arrow: async (req, res) => {
            let body = new String;
            await req.on('data', chunk => {
                body += chunk
            })
            console.log(body);
            // console.log(JSON.parse(body));
            // await JSON.parse(body).forEach(async element => {
            //   await Products.create(body)
            // });
            let products = new Array;
            await Products.find().then(result => products = result)
            res.end(JSON.stringify(products))
        }
    },
    {
        method: 'get',
        path: '/images?path=aqua.png',
        arrow: (req, res) => {
          const url = new URL('http://localhost' + req.url)
          fs.createReadStream('./src/img/' + url.searchParams.get('path')).pipe(res)
        }
    }
]