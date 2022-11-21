const Mongoose = require("mongoose")

module.exports = {
    async connect(){
        await Mongoose.connect('mongodb+srv://admin:admin@cluster0.j968cv8.mongodb.net/?retryWrites=true&w=majority')
    }
}