const mongoose = require('mongoose')
const { Users, Products } = require('../schemas/index.cjs')

module.exports = {
    Users: mongoose.model('Users', Users),
    Products: mongoose.model('Products', Products)
}