const Mongoose = require("mongoose");

module.exports = {
    Users: new Mongoose.Schema({
        name: String,
        password: String
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
            Buffer
        ],
        comments: [
            Number
        ],
        hit: Boolean,
        news: Boolean,
        price: Number,
        sale: Number,
        productName: String,
        rates: Number
    })
}