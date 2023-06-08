const Mongoose = require("mongoose");

module.exports = {
    Users: new Mongoose.Schema({
        name: String,
        mail: String,
        phone: Number,
        password: String,
        favorites: Array,
        cart: Array,
        viewed: Array,
        compare: Array
    }),
    Products: new Mongoose.Schema({
        description: {
            title: String,
            content: String
        },
        specification: {
            'productName': String,
            'Тип:': String,
            'Макс. скорость до (км/ч):': Number,
            'Мощность двигателя': Number,
            'Пробег на одном заряде': Number,
            'Тип переднего тормоза': String,
            'Круиз-контроль': String,
            'Мощность двигателя1': Number,
            'Макс. скорость до (км/ч)1:': Number,
            'Мощность двигателя2': Number,
            'Пробег на одном заряде1': Number,
            'Тип переднего тормоза1': String,
            'Круиз-контроль1': String,
            'Мощность двигателя3': Number,
            'Пробег на одном заряде2': Number,
            'Тип переднего тормоза2': String,
            'Круиз-контроль2': String,
            'Тип переднего тормоза3': String,
        },
        protection: Boolean,
        product: [
            String
        ],
        comments: [
            {
                userId: String,
                rate: Number,
                date: Number,
                title: String,
                content: String
            }
        ],
        hit: Boolean,
        news: Boolean,
        price: Number,
        sale: Number,
        productName: String,
        rates: Number,
        space: String,
        realPrice: String,
    }),
    News: new Mongoose.Schema({
        bigContent: {
            ftitle: String,
            fcontent: String,
            stitle: String,
            scontent: String
        },
        title: String,
        content: String,
        photo: String,
        to: String,
        date: String
    }),
    Promos: new Mongoose.Schema({
        src: String,
        title: String,
        content: String,
        terms: [ String ]
    }),
    Customs: new Mongoose.Schema({
        recs: [],
        indexP: [
              {
                every: [{
                    ...this.Products
                }],
                title: String,
                href: String
              }
        ]
    }),
}