const Mongoose = require("mongoose");

module.exports = {
    Users: new Mongoose.Schema({
        name: String,
        password: String
    })
}