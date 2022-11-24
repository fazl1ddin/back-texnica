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
    ...images,
]