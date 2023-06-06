const mongoose = require('mongoose')
const { Users, Products, News, Promos, Customs } = require('../schemas/index.cjs')

module.exports = {
    Users: mongoose.model('Users', Users),
    Products: mongoose.model('Products', Products),
    News: mongoose.model('News', News),
    Promos: mongoose.model('Promos', Promos),
    Customs: mongoose.model("Customs", Customs),
}